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
} from "@mui/material";
import { firestore } from "../base";
import { createTransfer } from "@solana/pay";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { recordTransaction, payInstallment } from "../utilities/ReduxGlobal";

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
        <Typography variant="h6" component="h2">
          Verification for Installment Payment
        </Typography>
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

  const nairaToSolRate = 0.0003; // Example: 1 Naira = 0.0003 SOL

  useEffect(() => {
    if (!product) {
      navigate("/");
    } else {
      const initialAmount = product.price;
      setAmount(initialAmount);
    }
  }, [product, navigate]);

  useEffect(() => {
    const calculatedAmount = paymentOption === "installment" ? product?.price / installments : product?.price;
    if (paymentMethod === "naira") {
      setAmount(calculatedAmount); // Amount in Naira
    } else if (paymentMethod === "crypto") {
      setAmount(calculatedAmount * (nairaToSolRate)); // Amount in SOL
    }
  }, [paymentOption, installments, product, paymentMethod]);

  const generateTrackingCode = () => Math.random().toString(36).substr(2, 9).toUpperCase();

  const storeInstallment = async (uid, price, reference, installmentOption, userDetails) => {
    const code = generateTrackingCode();
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

  const handlePayment = async (userDetails = null) => {
    try {
      const recipientPublicKey = "G4KqRAKkuac6QjvMMHSWjuscqaNq7GngVacS7mhwKooN"; // Replace with actual public key
      const connection = new Connection(clusterApiUrl("devnet"));
      const reference = Keypair.generate().publicKey.toString();

      console.log("Attempting payment...");
      console.log(`Payment Method: ${paymentMethod}`);
      console.log(`Amount: ${amount}`);
      console.log(`Recipient Public Key: ${recipientPublicKey}`);
      console.log(`Reference: ${reference}`);

      const lamports = Math.round(amount * Math.pow(10, 9)); // Convert SOL to lamports if payment is in SOL

      if (paymentMethod === "crypto") {
        const transferTransaction = await createTransfer({
          connection,
          recipient: recipientPublicKey,
          amount: lamports, // Pass the amount in lamports
          reference,
          memo: paymentOption === "full" ? "Full payment" : `Installment ${installments}`,
        });

        console.log("Processing Solana Pay transaction:", transferTransaction);

        if (!transferTransaction) {
          throw new Error("Transaction failed to process.");
        }
      } else {
        console.log(`Processing Naira payment of ₦${amount}`);
      }

      const code = await storeInstallment(
        "user-id", // Replace with actual user ID
        amount,
        reference,
        paymentOption,
        userDetails
      );

      dispatch(recordTransaction({
        productId: product.id,
        amount,
        paymentMethod,
        paymentOption,
        trackingCode: code,
        timestamp: new Date().toISOString(),
      }));

      if (paymentOption === "installment") {
        dispatch(payInstallment({ amount }));
      }

      setStatus(`${paymentOption === "full" ? "Full payment" : "Installment payment"} completed successfully. Tracking code: ${code}`);
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Payment failed:", error);
      setStatus("Payment failed. " + (error.message || ""));
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCheckout = () => {
    if (paymentOption === "installment") {
      setIsModalOpen(true);
    } else {
      handlePayment();
    }
  };

  const handleVerificationSubmit = (userDetails) => {
    setIsModalOpen(false);
    handlePayment(userDetails);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!product) return null;

  return (
    <Grid container spacing={3} sx={{ padding: { xs: 2, lg: 10 } }}>
      <Grid item xs={12}>
        <Typography variant="h4">Checkout</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Product name: {product.name}</Typography>
        <Typography variant="h6">
          Full Price: {paymentMethod === "crypto" ? `${(product.price * nairaToSolRate).toFixed(5)} SOL` : `₦${product.price}`}
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

      {paymentOption === "installment" && (
        <Grid item xs={12}>
          <TextField
            label="Number of Installments"
            type="number"
            value={installments}
            onChange={(e) => setInstallments(Math.max(1, parseInt(e.target.value)))}
            fullWidth
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel value="crypto" control={<Radio />} label="Cryptocurrency (SOL/USDC)" />
            <FormControlLabel value="naira" control={<Radio />} label="Naira (₦)" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label={`Amount to Pay (in ${paymentMethod === "crypto" ? "SOL" : "₦"})`}
          value={amount}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Proceed to Payment
        </Button>
      </Grid>

      <VerificationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleVerificationSubmit} />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {status}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Checkout;
