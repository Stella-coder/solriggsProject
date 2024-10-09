import { createQR } from "@solana/pay";
   import { Connection, clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
   import { createTransferCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

   const createSolanaPayTransaction = async () => {
     const connection = new Connection(clusterApiUrl("devnet"));
     const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Devnet USDC mint
     const MERCHANT_WALLET = new PublicKey("YOUR_MERCHANT_WALLET_ADDRESS");

     const mint = await getMint(connection, USDC_MINT);
     const amountInUSDC = Math.round(amount * Math.pow(10, mint.decimals));

     const merchantTokenAddress = await getAssociatedTokenAddress(USDC_MINT, MERCHANT_WALLET);
     const reference = new Uint8Array(32); // Use crypto.getRandomValues(new Uint8Array(32)) in production
     crypto.getRandomValues(reference);

     const url = new URL("https://yourapp.com/checkout");
     url.searchParams.append("reference", Buffer.from(reference).toString("base64"));

     const createTransactionFn = async (publicKey) => {
       const userTokenAddress = await getAssociatedTokenAddress(USDC_MINT, publicKey);
       const transaction = new Transaction().add(
         createTransferCheckedInstruction(
           userTokenAddress,
           USDC_MINT,
           merchantTokenAddress,
           publicKey,
           amountInUSDC,
           mint.decimals
         )
       );
       return transaction;
     };

     const qr = createQR(url, 512, "transparent");
     setQrCode(qr);

     return { url, createTransactionFn, reference };
   };