import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Sidebar from '../Sidebar/Sidebar';

const TransferRecord = () => {
  const [patientId, setPatientId] = useState('');
  const [newDoctorId, setNewDoctorId] = useState('');
  const [transferResult, setTransferResult] = useState('');

  const handleTransferRecord = async () => {
    try {
      const response = await axios.post('/transferRecord', {
        id: 'admin',
        patientId,
        newDoctorId,
        orgId: 'Hospital1',
      });

      if (response.data.error) {
        setTransferResult(response.data.error);
      } else {
        setTransferResult('Record transferred successfully.');
      }
    } catch (error) {
      setTransferResult('An error occurred.');
    }
  };

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Transfer Record
        </Typography>
        <Box component="div">
          <TextField
            label="Patient ID"
            variant="outlined"
            fullWidth
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="New Doctor ID"
            variant="outlined"
            fullWidth
            value={newDoctorId}
            onChange={(event) => setNewDoctorId(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <Button variant="contained" onClick={handleTransferRecord} sx={{ marginBottom: '16px' }}>
            Transfer Record
          </Button>
        </Box>
        <Box component="div">
          {transferResult && <Alert severity="success">{transferResult}</Alert>}
        </Box>
      </Box>
    </div>
  );
};

export default TransferRecord;
