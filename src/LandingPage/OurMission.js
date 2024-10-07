import React from 'react';
import { Box, Typography, Grid, Container, styled } from '@mui/material';
import missionImage from '../assets/image1.jpg'; // Replace with the actual image

const MissionPage = () => {
  return (
    <MainContainer>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', m:"10px" }}>
        Our Mission
      </Typography>

      <StyledContainer>
        <Grid container spacing={3}>
         

          {/* Text Section */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body1" paragraph>
                At SolRiggs, our mission is to democratize access to renewable energy solutions through innovation,
                technology, and flexibility. We believe that sustainability should not be a luxury but an achievable
                reality for all. By offering crypto-based installment payment options, we are enabling businesses and 
                individuals to adopt renewable energy products without the burden of upfront costs.
              </Typography>
              <Typography variant="body1" paragraph>
                Our platform utilizes the power of blockchain to offer transparent, secure, and efficient transactions,
                ensuring trust between buyers and sellers. We are committed to providing a marketplace that facilitates
                the global shift towards clean energy, helping our users contribute to a greener planet while enjoying
                the benefits of modern technology.
              </Typography>
              <Typography variant="body1">
                SolRiggs is more than just a marketplace—it's a movement toward a sustainable future.
              </Typography>
            </Box>
          </Grid>
           {/* Image Section */}
           <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden', borderRadius: '8px' }}>
              <img src={missionImage} alt="Our Mission" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
    </MainContainer>
  );
};

export default MissionPage;

// Styled Components
const MainContainer = styled(Box)({
  width: '100%', 
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const StyledContainer = styled(Container)({
  paddingTop: '64px',
  paddingBottom: '64px',
//   backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: '100vw',
});

