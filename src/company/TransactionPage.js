import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
// import { firestore } from '../base'; // Uncomment for Firebase integration

const mockTransactions = [
  {
    id: '1',
    buyer: 'John Doe',
    product: 'Solar Power Panel',
    amount: '$5000',
    status: 'Completed',
    date: '2024-09-20',
  },
  {
    id: '2',
    buyer: 'Jane Smith',
    product: 'Wind Turbine',
    amount: '$12000',
    status: 'Pending',
    date: '2024-09-21',
  },
  {
    id: '3',
    buyer: 'Alice Johnson',
    product: 'Hydro Power Generator',
    amount: '$15000',
    status: 'Failed',
    date: '2024-09-19',
  },
];

const TransactionTrackingPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions from Firebase
    /*
    const fetchTransactions = async () => {
      try {
        const snapshot = await firestore.collection('transactions').get();
        const fetchedTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
      setLoading(false);
    };
    fetchTransactions();
    */

    // Mock data for testing
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ padding: 2 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Transaction Tracking</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Transaction ID</TableCell>
              <TableCell align="left">Buyer</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell align="left">{transaction.id}</TableCell>
                <TableCell align="left">{transaction.buyer}</TableCell>
                <TableCell align="left">{transaction.product}</TableCell>
                <TableCell align="left">{transaction.amount}</TableCell>
                <TableCell align="left">{transaction.status}</TableCell>
                <TableCell align="left">{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TransactionTrackingPage;
