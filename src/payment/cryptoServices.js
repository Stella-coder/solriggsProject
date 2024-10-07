// src/components/InstallmentPayment.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createInstallment } from "../redux/slices/installmentSlice";
import { PublicKey } from "@solana/web3.js";
import { encodeURL } from "@solana/pay";
import { firestore } from "../firebase";

const InstallmentPayment = ({ productId, price }) => {
    const [installmentAmount, setInstallmentAmount] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user); // Adjust based on your auth state
    const solanaPayRecipient = new PublicKey("YOUR_SOLANA_WALLET_ADDRESS"); // Set your Solana wallet address

    const handleInstallmentPayment = async () => {
        if (!installmentAmount) return;

        const solAmount = installmentAmount / price; // Assuming price is in SOL

        // Create Solana Pay URL
        const url = encodeURL({
            recipient: solanaPayRecipient,
            amount: solAmount,
            reference: new PublicKey(user.uid),
        });

        // Log URL (or redirect for payment processing)
        console.log("Solana Pay URL:", url);

        // Add installment details to Firestore
        const installmentData = {
            userId: user.uid,
            productId,
            amount: installmentAmount,
            remainingBalance: price - installmentAmount,
            timestamp: new Date(),
            status: "pending",
        };

        await firestore.collection("installments").add(installmentData);
        dispatch(createInstallment(installmentData));

        // Redirect user to Solana Pay
        window.open(url.toString(), "_blank");
    };

    return (
        <div>
            <h3>Make an Installment Payment</h3>
            <input
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(Number(e.target.value))}
                placeholder="Installment amount in SOL"
            />
            <button onClick={handleInstallmentPayment}>Pay with Solana Pay</button>
        </div>
    );
};

export default InstallmentPayment;
