import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Grid, TextField, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { firestore } from "../base"; // Ensure Firebase setup is correct

const Checkout = () => {
  const location = useLocation();
  const [paymentOption, setPaymentOption] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [installments, setInstallments] = useState(1);
  const [amount, setAmount] = useState(location.state?.price || 1);
  const [status, setStatus] = useState("");

  // Firestore helper to store installment info with dummy data
  const storeInstallment = async (uid, price, reference, installmentOption) => {
    const paymentRef = firestore.collection("installments").doc(uid).collection("payments").doc(reference);
    await paymentRef.set({
      price,
      reference,
      installmentOption,
      paidAt: new Date(),
    });
    console.log("Installment stored:", { uid, price, reference, installmentOption });
  };

  const handleCheckout = async () => {
    if (paymentMethod === "crypto") {
      try {
        if (paymentOption === "full") {
          console.log("Processing full crypto payment of amount:", amount);
          await storeInstallment("userUID", amount, "referenceForFullPayment", "full");
          setStatus("Full payment completed successfully.");
        } else {
          console.log("Processing crypto installments:", installments);
          for (let i = 1; i <= installments; i++) {
            await storeInstallment("userUID", amount / installments, `installment-${i}`, "installment");
          }
          setStatus("Installment payments set up successfully.");
        }
      } catch (error) {
        console.error(error);
        setStatus("Payment failed.");
      }
    } else if (paymentMethod === "naira") {
      handleNairaPayment(paymentOption, amount, installments);
    }
  };

  // Dummy Naira payment handler
  const handleNairaPayment = (option, totalAmount, numInstallments) => {
    const installmentAmount = option === "installment" ? totalAmount / numInstallments : totalAmount;
    console.log(`Processing Naira payment of ₦${installmentAmount}`);
    // Simulate Naira payment here
  };

  return (
    <Grid container spacing={3} sx={{ padding: { xs: 2, lg: 10 } }}>
      <Grid item xs={12}>
        <Typography variant="h4">Checkout</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Total Amount: {amount} SOL</Typography>
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
            onChange={(e) => setInstallments(Number(e.target.value))}
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
          label="Total Amount (in SOL)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Proceed to Payment
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1" color="textSecondary">
          {status}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Checkout;
