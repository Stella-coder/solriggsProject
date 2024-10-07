import { createTransferInstruction } from '@solana/pay';
import { PublicKey, Transaction } from '@solana/web3.js';

const createInstallmentPayment = async (recipient, amount, reference, payer) => {
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));

  const transaction = new Transaction().add(
    createTransferInstruction(
      payer.publicKey,
      new PublicKey(recipient),
      amount,
      { reference } // Reference to track the installment payment
    )
  );

  await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
};
