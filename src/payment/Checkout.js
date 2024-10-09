import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Modal,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { firestore } from "../base";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { findReference, createQR } from "@solana/pay";
import { recordTransaction, payInstallment } from "../utilities/ReduxGlobal";

// USDC mint address and merchant wallet for your network
const USDC_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
const MERCHANT_WALLET = new PublicKey("AttBvY3FQrnSm13WQKXvRinTSYQrJ1HVEa78nqvVjogS");

const VerificationModal = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6">Verification for Installment Payment</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;

  const product = useSelector((state) => state.marketplace.products[productId]);

  const [paymentOption, setPaymentOption] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [installments, setInstallments] = useState(1);
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const [walletPublicKey, setWalletPublicKey] = useState(null);


  const nairaToUsdcRate = 0.0022; // Example rate for Naira to USDC

  useEffect(() => {
    if (!product) {
      navigate("/");
    } else {
      setAmount(product.price);
    }
  }, [product, navigate]);

  useEffect(() => {
    if (product) {
      const calculatedAmount = paymentOption === "installment" ? product.price / installments : product.price;
      setAmount(paymentMethod === "crypto" ? calculatedAmount * nairaToUsdcRate : calculatedAmount);
    }
  }, [paymentOption, installments, product, paymentMethod]);

  const storeInstallment = async (uid, price, reference, installmentOption, userDetails) => {
    const code = Math.random().toString(36).substr(2, 9).toUpperCase();
    const paymentRef = firestore.collection("installments").doc(uid).collection("payments").doc(reference);
    await paymentRef.set({
      price,
      reference,
      installmentOption,
      paidAt: new Date(),
      trackingCode: code,
      userDetails,
    });
    return code;
  };

  const createSolanaPayTransaction = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const mint = await getMint(connection, USDC_MINT);
      const decimals = mint?.decimals || 9;
      const amountInUSDC = Math.round(amount * 10 ** decimals);

      const merchantTokenAddress = await getAssociatedTokenAddress(USDC_MINT, MERCHANT_WALLET);
      const reference = Keypair.generate().publicKey;
      const url = new URL("https://yourapp.com/checkout");
      url.searchParams.append("reference", reference.toBase58());

      const createTransactionFn = async (publicKey) => {
        const userTokenAddress = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const transaction = new Transaction();
        transaction.add(
          createTransferCheckedInstruction(
            userTokenAddress,
            USDC_MINT,
            merchantTokenAddress,
            publicKey,
            amountInUSDC,
            decimals
          )
        );
        return transaction;
      };

      const qr = createQR(url, 512, "transparent");
      setQrCode(qr);

      return { url, createTransactionFn, reference };
    } catch (error) {
      console.error("Error in createSolanaPayTransaction:", error);
      throw error;
    }
  };

  const handlePayment = async (userDetails = null) => {
    setIsLoading(true);
    try {
      if (paymentMethod === "crypto" && !walletConnected) {
        throw new Error("Please connect your wallet first.");
      }

      const { url, createTransactionFn, reference } = await createSolanaPayTransaction();
      const connection = new Connection(clusterApiUrl("devnet"));
      const signatureInfo = await findReference(connection, reference, { finality: "confirmed" });

      if (signatureInfo.signature) {
        const code = await storeInstallment(
          "user-id",
          amount,
          signatureInfo.signature,
          paymentOption,
          userDetails
        );

        dispatch(recordTransaction({
          productId: product.id,
          amount,
          paymentMethod: paymentMethod === "crypto" ? "USDC" : "Naira",
          paymentOption,
          trackingCode: code,
          timestamp: new Date().toISOString(),
        }));

        if (paymentOption === "installment") {
          dispatch(payInstallment({ amount }));
        }

        setStatus(`Payment completed successfully. Tracking code: ${code}`);
        setSnackbarSeverity("success");
      } else {
        throw new Error("Transaction not found");
      }
    } catch (error) {
      setStatus("Payment failed. " + (error.message || ""));
      setSnackbarSeverity("error");
    } finally {
      setIsLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleVerificationSubmit = (userDetails) => {
    setIsModalOpen(false);
    handlePayment(userDetails);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleConnectWallet = async () => {
    try {
      if (window.solflare && window.solflare.isSolflare) {
        await window.solflare.connect();
        const publicKey = await window.solflare.publicKey;
        if (publicKey) {
          setWalletPublicKey(publicKey);
          setWalletConnected(true);
          setStatus("Wallet connected successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          throw new Error("Failed to get public key from Solflare");
        }
      } else {
        throw new Error("Solflare wallet not found. Please install the Solflare extension.");
      }
    } catch (error) {
      setStatus("Failed to connect to Solflare. " + (error.message || ""));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  

  if (!product) return null;

  return (
    <Grid container spacing={3} sx={{ padding: { xs: 2, lg: 10 } }}>
      <Grid item xs={12}>
        <Typography variant="h4">Checkout</Typography>
        <Typography variant="h6">Product name: {product.name}</Typography>
        <Typography variant="h6">
          Full Price: {paymentMethod === "crypto" ? `${(product.price * nairaToUsdcRate).toFixed(2)} USDC` : `₦${product.price}`}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Option</FormLabel>
          <RadioGroup row value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)}>
            <FormControlLabel value="full" control={<Radio />} label="Full Payment" />
            <FormControlLabel value="installment" control={<Radio />} label="Installment Payment" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel value="crypto" control={<Radio />} label="USDC" />
            <FormControlLabel value="naira" control={<Radio />} label="Naira" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {paymentOption === "installment" && (
        <Grid item xs={12}>
          <TextField
            label="Installments"
            type="number"
            value={installments}
            onChange={(e) => setInstallments(Math.max(1, +e.target.value))}
            fullWidth
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="h6">
          Payment Amount: {paymentMethod === "crypto" ? `${amount} USDC` : `₦${amount}`}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (paymentOption === "installment" ? setIsModalOpen(true) : handlePayment())}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} /> : "Pay Now"}
        </Button>
        {paymentMethod === "crypto" && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleConnectWallet}
            disabled={walletConnected}
            sx={{ mt: 2 }}
            fullWidth
          >
            {walletConnected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        )}
      </Grid>

      <VerificationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleVerificationSubmit} />
      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {status}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Checkout;
