import React, { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore'; // Import Firestore functions
import { firestore } from '../base'; // Ensure Firebase is set up correctly
import { useAuth } from '../utilities/AuthState'; // Hook to get the signed-in company

const CompanyProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to handle the loader
  const { user } = useAuth(); // Get the authenticated company (vendor)

  useEffect(() => {
    const fetchCompanyProducts = async () => {
      try {
        const companyUid = user.uid; // Assuming company UID is in the user's profile
        // Query to get products for the specific company
        const productsQuery = query(
          collection(firestore, 'companies', companyUid, 'products')
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchCompanyProducts();
  }, [user]);

  return (
    <Box sx={{ marginLeft: '5px', padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Products
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {products.length ? (
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
      )}
    </Box>
  );
};

export default CompanyProductPage;
