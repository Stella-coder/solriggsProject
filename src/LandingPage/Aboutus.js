import React from 'react';
import { Box, Typography, Grid, Container, styled } from '@mui/material';
import aboutImage from '../assets/image1.jpg';

const AboutPage = () => {
  return (
    <MainContainer>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        About Us
      </Typography>
      
      <StyledContainer>
        <Grid container spacing={3}>
          {/* Text Section */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', order: { xs: 1, md: 2 } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" paragraph>
                Welcome to SolRiggs, the revolutionary eCommerce marketplace designed to empower both businesses and consumers in the renewable energy space. We are a platform that bridges the gap between sustainable energy solutions and innovative payment options, leveraging the power of cryptocurrency and blockchain technology.
                <div>
                  As the demand for renewable energy grows, so does the need for flexible and secure payment solutions. SolRiggs combines the power of cryptocurrency with the flexibility of installment payments, allowing you to embrace sustainable energy without financial barriers. We are more than just a marketplace; we are a movement towards a greener, more sustainable future for everyone.
                </div>
                <div>
                  Join us on our mission to revolutionize the renewable energy market. With SolRiggs, sustainability is not just a choice — it’s an accessible, affordable reality.
                </div>
              </Typography>
            </Box>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', order: { xs: 2, md: 1 } }}>
            <Box sx={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden', borderRadius: '8px' }}>
              <img src={aboutImage} alt="About Us" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
    </MainContainer>
  );
};

export default AboutPage;

// Styled Components
const MainContainer = styled(Box)({
  width: '100%', // Full viewport width
  minHeight: '100vh', // Full viewport height
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const StyledContainer = styled(Container)({
  paddingTop: '64px',
  paddingBottom: '64px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for styling
  maxWidth: '100vw', // Set max width for larger screens
});
