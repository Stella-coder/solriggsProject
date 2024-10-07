import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // to capture route parameters
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../base';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const CompanyDetail = () => {
  const { id } = useParams(); // Get the company ID from the URL
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const docRef = doc(firestore, 'companies', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCompanyData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  // Loader while data is loading
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!companyData) {
    return (
      <Container maxWidth="md" sx={{ minHeight: '100vh', padding: '80px 20px 20px' }}>
        <Typography>No company found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ padding: '80px 20px 20px', minHeight: '100vh' }}>
      <Box mt={4}>
        <Typography variant="body1"><strong>Product Image:</strong></Typography>
        <img src={companyData.productImage} alt={companyData.companyName} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
      </Box>
      <Typography variant="h4" gutterBottom>{companyData.companyName}</Typography>
      <Typography variant="body1"><strong>Business Number:</strong> {companyData.businessNumber}</Typography>
      <Typography variant="body1"><strong>Contact Email:</strong> {companyData.contactEmail}</Typography>
      <Typography variant="body1"><strong>Contact Phone:</strong> {companyData.contactPhone}</Typography>
      <Typography variant="body1"><strong>Website:</strong> {companyData.website}</Typography>
      <Typography variant="body1"><strong>Business Type:</strong> {companyData.businessType}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {companyData.description}</Typography>
      <Typography variant="body1"><strong>Products:</strong> {companyData.productList}</Typography>
      <Typography variant="body1"><strong>Crypto Wallet:</strong> {companyData.cryptoWallet}</Typography>
      <Typography variant="body1"><strong>Installment Plans:</strong> {companyData.installmentPlans}</Typography>
    </Container>
  );
};

export default CompanyDetail;
