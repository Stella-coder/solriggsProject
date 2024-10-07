import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, MenuItem, CircularProgress, FormControl, FormLabel } from '@mui/material';
import { firestore, auth, storage } from '../base'; // Firebase services
import { collection, addDoc } from 'firebase/firestore'; // Firestore
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'; // Firebase Storage
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const businessTypes = [
  { value: 'solar', label: 'Solar Energy' },
  { value: 'wind', label: 'Wind Energy' },
  { value: 'battery', label: 'Battery Storage' },
  {value:"others", label:"Others"}
];

// Custom styled components
const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(8),
}));

const ImagePreview = styled('div')(({ theme, src, loading }) => ({
  width: '100%',
  height: '200px',
  background: `url(${src || ''}) no-repeat center center`,
  backgroundSize: 'cover',
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  '&::before': {
    content: '"Uploading..."',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: theme.shape.borderRadius,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: loading ? 1 : 0,
    visibility: loading ? 'visible' : 'hidden',
    transition: 'opacity 0.3s',
  }
}));

const CompanyRegistrationForm = () => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    companyName: '',
    businessNumber: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    businessType: '',
    description: '',
    productList: '',
    cryptoWallet: '',
    installmentPlans: '',
    password: '',
    isApproved: false,
  });

  const [certificateFile, setCertificateFile] = useState(null); // Certificate file
  const [image, setImage] = useState(null); // Uploaded product image
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress for images
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]); // Set certificate file
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file); // Use uploadBytesResumable for resumable uploads
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef); // Fetch the download URL after upload completes
            setImage(downloadURL);
            setUploading(false);
          } catch (error) {
            console.error('Error getting download URL:', error);
            setUploading(false);
          }
        }
      );
    }
  };
  const validateForm = () => {
    const { companyName, businessNumber, contactEmail, contactPhone, website, password } = formValues;
    if (!companyName || !businessNumber || !contactEmail || !contactPhone || !website || !password) {
      setError('All fields are required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if (uploadProgress < 100 && uploading) {
      alert('Please wait until the image is fully uploaded.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(formValues.contactEmail, formValues.password);
      const user = userCredential.user;

      // Store company details in Firestore
      const docRef = await addDoc(collection(firestore, 'companies'), {
        ...formValues,
        uid: user.uid, // Reference the registered user
        role: 'company', // Define role as 'company'
        productImage: image, // Product image URL
        createdAt: new Date(),
      });

      // Handle certificate file upload
      if (certificateFile) {
        const storageRef = ref(storage, `company_certificates/${docRef.id}`);
        await uploadBytes(storageRef, certificateFile);
      }

      alert('Company registered successfully with certificate uploaded!, yow will have access to your dashboard after 24 hours if approved');
      navigate("/")


      // Clear form fields on successful submission
      setFormValues({
        companyName: '',
        businessNumber: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        businessType: '',
        description: '',
        productList: '',
        cryptoWallet: '',
        installmentPlans: '',
        password: '',
        termsAccepted: false,
      });
      setCertificateFile(null); // Clear certificate file
      setImage(null); // Clear image
      setUploadProgress(0); // Reset upload progress
    } catch (error) {
      console.error('Error registering company:', error);
      setError('Failed to register the company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ padding: "80px 10px 10px" }}>
      <Typography variant="h4" gutterBottom>
        Company Registration
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Company Name"
              name="companyName"
              fullWidth
              required
              value={formValues.companyName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Business Registration Number"
              name="businessNumber"
              fullWidth
              required
              value={formValues.businessNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Email"
              name="contactEmail"
              type="email"
              fullWidth
              required
              value={formValues.contactEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Phone"
              name="contactPhone"
              fullWidth
              required
              value={formValues.contactPhone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company Website"
              name="website"
              fullWidth
              required
              value={formValues.website}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Business Type"
              name="businessType"
              fullWidth
              required
              value={formValues.businessType}
              onChange={handleInputChange}
            >
              {businessTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Business Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={formValues.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Product List (Comma-separated)"
              name="productList"
              fullWidth
              multiline
              rows={2}
              value={formValues.productList}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Crypto Wallet Address"
              name="cryptoWallet"
              fullWidth
              required
              value={formValues.cryptoWallet}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Installment Plans"
              name="installmentPlans"
              fullWidth
              multiline
              rows={2}
              value={formValues.installmentPlans}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              value={formValues.password}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel>Upload Company Certificate</FormLabel>
          <TextField
            type="file"
            fullWidth
            onChange={handleFileChange}
            inputProps={{ accept: 'application/pdf,image/*' }} // Accept PDF and images
          />
        </FormControl>
      </Grid>

      {/* Upload Image */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel>Upload Company Logo</FormLabel>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {uploading && <CircularProgress />}
          <ImagePreview src={image} loading={uploading} />
        </FormControl>
      </Grid>
          <Grid item xs={12}>
            <Button sx={{bgcolor:"rgb(46,107,98)"}} type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Register Company'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CompanyRegistrationForm;
