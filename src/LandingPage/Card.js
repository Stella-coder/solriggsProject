// ProductCard.js

import React from 'react';
// import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Button, CardActionArea } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  maxWidth: 345,
  margin: '16px',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ProductCard = ({ image, title, price, description }) => {
  return (
    <StyledCard>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${price}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Button size="small" color="primary" style={{ margin: '16px' }}>
        Add to Cart
      </Button>
    </StyledCard>
  );
};

// ProductCard.propTypes = {
//     image: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     description: PropTypes.string.isRequired,
//   };

export default ProductCard;
