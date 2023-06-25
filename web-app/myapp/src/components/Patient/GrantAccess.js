import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Sidebar from '../Sidebar/Sidebar';

const GrantAccess = () => {
  const [patientId, setPatientId] = useState(localStorage.getItem('username') || '');
  const [doctorId, setDoctorId] = useState('');
  const [accessResult, setAccessResult] = useState('');

  const handleGrantAccess = async () => {
    try {
      const response = await axios.post('/grantAccess', {
        id: 'admin',
        patientId: patientId,
        doctorId: doctorId,
        orgId: 'Hospital1',
      });

      if (response.data.error) {
        setAccessResult({ message: response.data.error, severity: 'error' });
      } else {
        setAccessResult({ message: 'Access granted successfully.', severity: 'success' });
      }
    } catch (error) {
      setAccessResult({ message: 'An error occurred.', severity: 'error' });
    }
  };

  const handleRevokeAccess = async () => {
    try {
      const response = await axios.post('/revokeAccess', {
        id: 'admin',
        patientId: patientId,
        doctorId: doctorId,
        orgId: 'Hospital1',
      });

      if (response.data.error) {
        setAccessResult({ message: response.data.error, severity: 'error' });
      } else {
        setAccessResult({ message: 'Access revoked successfully.', severity: 'success' });
      }
    } catch (error) {
      setAccessResult({ message: 'An error occurred.', severity: 'error' });
    }
  };

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Grant/Revoke Access
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '16px' }}>
          Grant or revoke access for a patient to a specific doctor within an organization.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <TextField
            label="Patient ID"
            variant="outlined"
            value={patientId}
            disabled
          />
          <TextField
            label="Doctor ID"
            variant="outlined"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Button variant="contained" onClick={handleGrantAccess}>
              Grant Access
            </Button>
            <Button variant="contained" color="error" onClick={handleRevokeAccess}>
              Revoke Access
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: '16px' }}>
          {accessResult && (
            <Alert severity={accessResult.severity} sx={{ color: accessResult.severity === 'error' ? 'red' : 'green' }}>
              {accessResult.message}
            </Alert>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default GrantAccess;
