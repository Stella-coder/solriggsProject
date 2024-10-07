
import React, { useState } from 'react';
import { Button, Box, Typography, styled } from '@mui/material';

const LoginOptions = () => {
  // Use a single state to manage the selected option
  const [selectedOption, setSelectedOption] = useState('option1');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <StyledContainer>
      <ContentBox>
        <Typography variant="h4" gutterBottom>
          <Button onClick={() => handleOptionSelect('option1')}>Company Login</Button>
          <Button onClick={() => handleOptionSelect('option2')} sx={{ ml: 2 }}>User Login</Button>
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedOption === 'option1' ? 
            '1. Fill out the registration form with accurate details.\n' +
            '2. Submit the form and check your email for a confirmation link.\n' +
            '3. Click the confirmation link to complete registration.' 
            : 
            '1. Choose a unique username and password.\n' +
            '2. Verify your email address through a sent confirmation link.\n' +
            '3. Complete your profile by providing additional information.'}
        </Typography>
      </ContentBox>
    </StyledContainer>
  );
};

export default LoginOptions;

// Styled components using @mui/system

const StyledContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  maxWidth: '600px', // Adjust as needed
  textAlign: 'center'
}));




