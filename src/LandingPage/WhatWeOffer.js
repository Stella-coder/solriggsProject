import React from 'react';
import { Box, Typography, Grid, Container, styled, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import dispute from '../assets/dispute.jpg'; // Replace with actual icons
import solana from '../assets/solana.jpg';
import flex from '../assets/flex.jpg';
import verify from '../assets/verify.jpg';

const WhatWeOfferPage = () => {
  // Animation variants for motion components
  const cardVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const hoverEffect = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  const offers = [
    {
      icon: flex,
      title: 'Flexible Installment Plan',
      description:
        "You can purchase products using crypto-based installments, making it easier to invest in renewable energy without large upfront costs.",
    },
    {
      icon: solana,
      title: 'Blockchain-Powered Security',
      description:
        "Our platform is built on the Solana blockchain, ensuring fast, low-cost, and secure transactions, backed by decentralized technology.",
    },
    {
      icon: verify,
      title: 'Verified Vendors',
      description:
        "We work with trusted companies that have been thoroughly verified to offer high-quality products.",
    },
    {
      icon: dispute,
      title: 'Dispute Resolution',
      description:
        "We provide transparent and fair dispute settlement mechanisms to ensure smooth and trustworthy transactions.",
    },
  ];

  return (
    <MainContainer>
      <StyledContainer>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            What We Offer
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: '30px' }}>
            Discover the innovative solutions SolRiggs provides to help you transition to renewable energy seamlessly.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {offers.map((offer, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <motion.div
                  whileHover={hoverEffect}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                >
                  <OfferCard elevation={4}>
                    <IconBox>
                      <img src={offer.icon} alt={offer.title} style={{ width: '80px', height: '80px' ,objectFit:"cover", borderRadius:"50%"}} />
                    </IconBox>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                      {offer.title}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '10px', color: '#555' }}>
                      {offer.description}
                    </Typography>
                  </OfferCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </StyledContainer>
    </MainContainer>
  );
};

export default WhatWeOfferPage;

// Styled Components
const MainContainer = styled(Box)({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  paddingTop: '64px',
  paddingBottom: '64px',
});

const StyledContainer = styled(Container)({
  maxWidth: '1200px',
  padding: '20px',
});

const OfferCard = styled(Paper)({
  padding: '20px',
  borderRadius: '16px',
  textAlign: 'center',
  height: '100%',
  minHeight: '300px', // Ensure all cards have the same height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Ensure even spacing between icon and text
  alignItems: 'center',
  backgroundColor: '#fff',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
});

const IconBox = styled(Box)({
  width: '100px',
  height: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
  backgroundColor: '#e0f7fa',
  borderRadius: '50%',
});
