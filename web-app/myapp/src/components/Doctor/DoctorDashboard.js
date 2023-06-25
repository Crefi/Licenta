import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Sidebar from '../Sidebar/Sidebar';

const DoctorDashboard = () => {
  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px', padding: '16px' }}>
        <Typography variant="h6" gutterBottom>
          Doctor Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is the doctor dashboard. Select one of the following functionalities:
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: '16px' }}>
          <Grid item xs={12} md={4}>
            <Button variant="contained" component={Link} to="/registerPatient">
              Register Patient
            </Button>
            <Box sx={{ marginTop: '8px' }}>
              <Typography variant="body2" gutterBottom>
                Register the patient record to the blockchain.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" component={Link} to="/transferRecord">
              Transfer Record
            </Button>
            <Box sx={{ marginTop: '8px' }}>
              <Typography variant="body2" gutterBottom>
                Transfer a patient's medical record to another doctor.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" component={Link} to="/readPatientData">
              Read Patient Data
            </Button>
            <Box sx={{ marginTop: '8px' }}>
              <Typography variant="body2" gutterBottom>
                View the medical data of a registered patient if You have granted access to it from the patient.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default DoctorDashboard;
