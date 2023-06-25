import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const userId = 'admin';
        const orgId = 'Hospital1';
        const patientId = localStorage.getItem('username');
        const response = await axios.get('/readPatientData', {
          params: { id: userId, patientId: patientId, orgId: orgId }
        });
        setPatientData(response.data);
      } catch (error) {
        console.error(error);
        setPatientData(null);
        setErrorMessage('Error retrieving patient data.');
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box p={2}>
        {patientData ? (
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Patient ID: {patientData.PatientId}
              </Typography>
              <Typography variant="body1" component="div">
                Address: {patientData.Address}
              </Typography>
              <Typography variant="body1" component="div">
                Telephone ID: {patientData.Telephone}
              </Typography>
              <Typography variant="body1" component="div">
                Diagnosis ID: {patientData.Diagnosis}
              </Typography>
              <Typography variant="body1" component="div">
                Medication: {patientData.Medication}
              </Typography>
              <Typography variant="body1" component="div">
                Doctor Authorization List: {patientData.DoctorAuthorizationList.join(', ')}
              </Typography>
              <Typography variant="body1" component="div">
                Organisation Authorization List: {patientData.OrganisationAuthorizationList.join(', ')}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert severity="info">
              No patient records found for patient ID: {localStorage.getItem('username')}. Please visit a hospital and ask a doctor to register your data.
            </Alert>
          </>
        )}
      </Box>
    </div>
  );
};

export default PatientDashboard;
