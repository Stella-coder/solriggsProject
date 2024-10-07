import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { storage, firestore, auth } from '../base'; // Ensure Firebase is correctly set up
import { useAuth } from '../utilities/AuthState'; // Use your AuthState context

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mt: theme.spacing(8),
}));

const ImagePreview = styled('div')(({ theme, src }) => ({
  width: '100%',
  height: 'auto',
  background: `url(${src || ''}) no-repeat center center`,
  backgroundSize: 'cover',
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  height: '200px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    visibility: ({ loading }) => (loading ? 'visible' : 'hidden'),
    opacity: ({ loading }) => (loading ? 1 : 0),
    transition: 'opacity 0.3s',
  }
}));

const AddProduct = () => {
  const { user } = useAuth(); // Get the authenticated user (company)
  // console.log(user)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    installmentOptions: '',
    energyOutput: '',
    warranty: '',
    disputeSettlement: '',
    quantity: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setUploading(true);
      uploadImage(event.target.files[0]);
    }
  };

  const uploadImage = (file) => {
    const uploadTask = storage.ref(`images/${file.name}`).put(file); // Firebase storage integration

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => console.error(error),
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setImage(url);
          setUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert('User not authenticated. Please log in as a company.');
      return;
    }

    if (uploadProgress < 100) {
      alert('Please wait until the image is fully uploaded.');
      return;
    }

    const companyUid = user.uid; // Assuming the company UID is stored in the authenticated user's profile
    const productData = { ...formData, image };
    console.log(user, "userdd")

    try {
      setLoading(true);
      // Verify that the user is a company (assuming this is indicated in the user profile)
      // if (user.role !== 'company') {
      //   alert('You are not authorized to add products.');
      //   return;
      // }

      // Add product to Firestore under the specific company's collection
      await firestore.collection('companies').doc(companyUid).collection('products').add(productData);
      alert('Product added successfully!');
      // Reset the form after successful submission
      setFormData({ 
        name: '', 
        description: '', 
        price: '', 
        installmentOptions: '', 
        energyOutput: '', 
        warranty: '', 
        disputeSettlement: '', 
        quantity: '' ,
        type:""
      });
      setImage(null);
      setUploadProgress(0); // Reset upload progress
    } catch (error) {
      console.error('Error submitting form: ', error);
      alert('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledBox>
        <Typography component="h1" variant="h5" sx={{ mt: 4 , fontStyle: "italic", fontWeight: "bold" }}>
          Add Product
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span" sx={{ mt: 2, mb: 2 , bgcolor: "#2E6B62" }}>
              Upload Image
            </Button>
          </label>
          {image && (
            <ImagePreview src={image} loading={uploading}>
              {uploading && <CircularProgress />}
            </ImagePreview>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            autoComplete="description"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            autoComplete="price"
          />
           <TextField
            margin="normal"
            required
            fullWidth
            id="type"
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            autoComplete="type"
          />
         
          <TextField
            margin="normal"
            fullWidth
            id="installmentOptions"
            label="Installment Options (e.g., 3 months, 6 months)"
            name="installmentOptions"
            type="number"
            value={formData.installmentOptions}
            onChange={handleChange}
            autoComplete="installment-options"
          />
          <TextField
            margin="normal"
            fullWidth
            id="energyOutput"
            label="Energy Output"
            name="energyOutput"
            value={formData.energyOutput}
            onChange={handleChange}
            autoComplete="energyOutput"
          />
          <TextField
            margin="normal"
            fullWidth
            id="warranty"
            label="Warranty"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            autoComplete="warranty"
          />
          <TextField
            margin="normal"
            fullWidth
            id="disputeSettlement"
            label="Dispute Settlement (e.g., 5 years warranty)"
            name="disputeSettlement"
            value={formData.disputeSettlement}
            onChange={handleChange}
            autoComplete="disputeSettlement"
          />
          <TextField
            margin="normal"
            fullWidth
            id="quantity"
            label="Quantity (e.g., 5 units)"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            autoComplete="quantity"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#2E6B62" }}
            disabled={uploading || loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </StyledBox>
    </Container>
  );
};

export default AddProduct;
