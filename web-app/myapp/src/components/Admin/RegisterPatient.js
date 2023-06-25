import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Sidebar from '../Sidebar/Sidebar';

const RegisterPatient = () => {
  const [patientId, setPatientId] = useState('');
  const [orgId, setOrg] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/registerPatient', {
        id: 'admin',
        patientId,
        address,
        telephone,
        diagnosis,
        medication,
        doctorId,
        orgId,
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setSuccessMessage('');
      } else {
        setSuccessMessage('Patient registered successfully.');
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px' }}>
        <Typography variant="h6" component="h1" gutterBottom>
          Register Patient
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '400px' }}>
          <TextField
            label="Patient ID"
            variant="outlined"
            fullWidth
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Org"
            variant="outlined"
            fullWidth
            value={orgId}
            onChange={(event) => setOrg(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Telephone"
            variant="outlined"
            fullWidth
            value={telephone}
            onChange={(event) => setTelephone(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Diagnosis"
            variant="outlined"
            fullWidth
            value={diagnosis}
            onChange={(event) => setDiagnosis(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Medication"
            variant="outlined"
            fullWidth
            value={medication}
            onChange={(event) => setMedication(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Doctor ID"
            variant="outlined"
            fullWidth
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <Button type="submit" variant="contained" sx={{ marginBottom: '16px' }}>
            Submit
          </Button>
        </Box>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </Box>
    </div>
  );
};

export default RegisterPatient;
