import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { collection, getDocs, doc, getDoc, query } from 'firebase/firestore'; // Firebase Firestore imports
import { auth, firestore } from '../base'; // Firebase Firestore instance
import { useAuth } from '../utilities/AuthState'; // Custom hook to get the authenticated user

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null); // State for company details
  const [loading, setLoading] = useState(true); // Loading state for when data is being fetched
  const { user } = useAuth(); // Get the authenticated user (company)
// console.log(user.uid)
  const id = user?.id
  // Function to fetch company details
  const fetchCompanyDetails = async () => {
    try {
      if (!user || !user.uid) {
        console.error("No user logged in or user ID not available");
        return;
      }

      const companyDocRef = doc(firestore, 'companies', user.uid); // Reference to the company document
      const companyDoc = await getDoc(companyDocRef); // Fetch the document
      
      if (companyDoc.exists()) {
        setCompanyDetails({ id: companyDoc.id, ...companyDoc.data() }); // Set company details to state
        console.log(companyDetails, "det")
      } else {
        console.error("No such company document!");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const fetchCompanyProducts = async () => {
    try {
      if (!user || !user.uid) {
        console.error("No user logged in or user ID not available");
        return;
      }

      const productsQuery = query(collection(firestore, 'companies', user.uid, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(productsList, "list of products");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Call the functions to fetch data
  useEffect(() => {
    if (user && user.uid) { // Only run if user and user.uid are defined
      const fetchData = async () => {
        setLoading(true);
        await fetchCompanyDetails();
        await fetchCompanyProducts();
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ padding: { xs: 1, md: 3 }, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome, {user?.displayName || 'Company'}
      </Typography>

      {/* Overview Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Company Overview
        </Typography>
        {companyDetails ? (
          <>
            <Typography variant="body1">
              <strong>Registration Number:</strong> {companyDetails.businessNumber || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Contact Email:</strong> {companyDetails.email || 'N/A'}
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>Edit Profile</Button>
          </>
        ) : (
          <Typography variant="body1">Loading company details...</Typography>
        )}
      </Box>

      {/* Loader while fetching data */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Products Table */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Products
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.price}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No products available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Transactions Table */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Transactions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No transactions available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
