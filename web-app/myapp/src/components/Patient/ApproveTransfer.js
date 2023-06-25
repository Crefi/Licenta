import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Sidebar from '../Sidebar/Sidebar';

const ApproveTransfer = () => {
  const [patientId] = useState(localStorage.getItem('username') || '');
  const [newDoctorId, setDoctorId] = useState('');
  const [approveTransferResult, setApproveTransferResult] = useState('');

  const handleApproveTransfer = async () => {
    try {
      const response = await axios.post('/approveTransfer', {
        id: 'admin',
        patientId: patientId,
        newDoctorId: newDoctorId,
        orgId: 'Hospital1',
      });

      if (response.data.error) {
        setApproveTransferResult(response.data.error);
      } else {
        setApproveTransferResult('Approve granted successfully.');
      }
    } catch (error) {
      setApproveTransferResult('An error occurred.');
    }
  };

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Approve Transfer
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <TextField
            label="Patient ID"
            variant="outlined"
            value={patientId}
            disabled
          />
          <TextField
            label="Approve New Doctor"
            variant="outlined"
            value={newDoctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
          <Button variant="contained" onClick={handleApproveTransfer}>
            Approve Transfer
          </Button>
        </Box>
        <Box sx={{ marginTop: '16px' }}>
          {approveTransferResult && <Alert severity="success">{approveTransferResult}</Alert>}
        </Box>
      </Box>
    </div>
  );
};

export default ApproveTransfer;
