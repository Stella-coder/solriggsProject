// src/utils/solanaPay.js
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as solanaPay from '@solana/pay';

const connection = new Connection(clusterApiUrl('devnet'));

export const createTransaction = async (recipient, amount) => {
    const to = new PublicKey(recipient);
    const lamports = amount * solanaPay.LAMPORTS_PER_SOL; // Convert SOL to lamports

    const transaction = await solanaPay.createTransaction({
        connection,
        from: wallet.publicKey, // The user's wallet
        to,
        lamports,
    });

    return transaction;
};
