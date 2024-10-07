import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../base'; // Firebase initialization
import { useNavigate } from 'react-router-dom'; // For routing
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [message, setMessage] = useState('');
  const [isMessageDialogOpen, setMessageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // Filter by approved/rejected
  const navigate = useNavigate(); // Hook for navigation

  // Fetch all companies (approved and unapproved)
  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesRef = collection(firestore, 'companies');
      const companySnapshot = await getDocs(companiesRef);
      const companyList = companySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompanies(companyList);
      setFilteredCompanies(companyList); // Initial load
    };

    fetchCompanies();
  }, []);

  // Approve a company
  const approveCompany = async (companyId) => {
    const companyRef = doc(firestore, 'companies', companyId);
    await updateDoc(companyRef, { isApproved: true });
    setMessage(`Company has been approved.`);
    setSelectedCompany(null);
    setMessageDialogOpen(true);

    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === companyId ? { ...company, isApproved: true } : company
      )
    );
    handleFilterChange(filterStatus); // Reapply filter after update
  };

  // Reject a company
  const rejectCompany = async (companyId) => {
    const companyRef = doc(firestore, 'companies', companyId);
    await updateDoc(companyRef, { isApproved: false });
    setMessage(`Company has been rejected.`);
    setSelectedCompany(null);
    setMessageDialogOpen(true);

    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === companyId ? { ...company, isApproved: false } : company
      )
    );
    handleFilterChange(filterStatus); // Reapply filter after update
  };

  // Open message dialog
  const handleSendMessage = (company) => {
    setSelectedCompany(company);
    setMessageDialogOpen(true);
  };

  const handleDialogClose = () => {
    setMessageDialogOpen(false);
    setMessage('');
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      setFilteredCompanies(companies);
    } else if (status === 'approved') {
      setFilteredCompanies(companies.filter((company) => company.isApproved));
    } else if (status === 'rejected') {
      setFilteredCompanies(companies.filter((company) => !company.isApproved));
    }
  };

  // Handle delete company
  const handleDeleteCompany = async (companyId) => {
    const companyRef = doc(firestore, 'companies', companyId);
    await deleteDoc(companyRef);
    setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== companyId));
    handleCloseDeleteDialog();
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCompany(null);
  };

  return (
    <Box sx={{ paddingTop: '80px', padding:"0px 20px", minHeight:"100vh"}}>
      <Typography variant="h4" gutterBottom>
        Company Approvals & Management
      </Typography>

      {/* Filter Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Filter Companies</Typography>
        <Select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          sx={{ width: '200px', marginBottom: 2 }}
        >
          <MenuItem value="all">All Companies</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </Box>

      {/* Table to display companies */}
      {filteredCompanies.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>{company.uid}</TableCell>
                  <TableCell>{company.isApproved ? 'Approved' : 'Pending'}</TableCell>
                  <TableCell>
                    {!company.isApproved ? (
                      <>
                        <Button variant="contained" color="primary" onClick={() => approveCompany(company.id)}>
                          Approve
                        </Button>
                        <Button variant="contained" color="error" onClick={() => rejectCompany(company.id)}>
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outlined" onClick={() => handleSendMessage(company)}>
                          Send Message
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenDeleteDialog(company)}
                          color="error"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/viewdetails/${company.id}`)} // Navigate to the company detail page
                        >
                          View Details
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No company found.</Typography>
      )}

      {/* Dialog for Sending Messages */}
      <Dialog open={isMessageDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Send Message to {selectedCompany?.companyName}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{message || 'You can send a custom message to the company.'}</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Custom Message"
            type="text"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              alert(`Message to ${selectedCompany?.companyName}: ${message}`);
              handleDialogClose();
            }}
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {selectedCompany?.companyName}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteCompany(selectedCompany.id);
              alert(`${selectedCompany.companyName} has been deleted.`);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
