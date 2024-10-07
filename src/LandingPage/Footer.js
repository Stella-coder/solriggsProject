import React from 'react';
import { Box, Typography, Grid, Container, styled, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <FooterContainer>
      <StyledContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Connect with Us
            </Typography>
            <Box textAlign="center">
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
      <Copyright>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} SolRiggs. All rights reserved.
        </Typography>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components
const FooterContainer = styled(Box)({
  backgroundColor: '#e0e0e0',
  paddingTop: '20px',
});

const StyledContainer = styled(Container)({
  maxWidth: '1200px',
});

const Copyright = styled(Box)({
  textAlign: 'center',
  padding: '20px 0',
  backgroundColor: 'rgb(46,107,98)',
});
