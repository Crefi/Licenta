import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Alert from '@mui/material/Alert';
import Sidebar from '../Sidebar/Sidebar';

const ReadPatientData = () => {
  const [patientId, setPatientId] = useState('');
  const [hospitalId, setHospitalId] = useState('');

  const [result, setResult] = useState({});
  const [tableData, setTableData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const doctorId = localStorage.getItem('username') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    try {
      const response = await axios.post('/readPatientData', {
        id: 'admin',
        patientId,
        orgId: hospitalId,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({});
    }
  };

  useEffect(() => {
    if (doctorId && result.DoctorAuthorizationList && !result.DoctorAuthorizationList.includes(doctorId)) {
      setErrorMessage('Invalid doctor ID, Please Ask the patient to grant you access');
    } else {
      setErrorMessage('');
    }
  }, [doctorId, result]);

  useEffect(() => {
    if (Object.keys(result).length > 0) {
      const data = [
        {
          ...result,
          DoctorAuthorizationList: [result.DoctorAuthorizationList],
          OrganisationAuthorizationList: [result.OrganisationAuthorizationList],
        },
      ];
      const tableData = data.map((record, index) => (
        <TableRow key={index}>
          <TableCell>{record.PatientId}</TableCell>
          <TableCell>{record.Address}</TableCell>
          <TableCell>{record.Telephone}</TableCell>
          <TableCell>{record.Diagnosis}</TableCell>
          <TableCell>{record.Medication}</TableCell>
          <TableCell>{record.DoctorAuthorizationList.join(', ')}</TableCell>
          <TableCell>{record.OrganisationAuthorizationList.join(', ')}</TableCell>
        </TableRow>
      ));
      setTableData(tableData);
    }
  }, [result]);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Get Patient Data
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Patient ID"
            variant="outlined"
            fullWidth
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            label="Hospital Name"
            variant="outlined"
            fullWidth
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <Button variant="contained" type="submit" sx={{ marginBottom: '16px' }}>
            Submit
          </Button>
        </Box>
        {submitted && errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {submitted && tableData.length > 0 && !errorMessage ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient ID</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Telephone ID</TableCell>
                  <TableCell>Diagnosis ID</TableCell>
                  <TableCell>Medication</TableCell>
                  <TableCell>Doctor Authorization List</TableCell>
                  <TableCell>Organisation Authorization List</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableData}</TableBody>
            </Table>
          </TableContainer>
        ) : submitted ? (
          <Alert severity="info">No records found.</Alert>
        ) : null}
      </Box>
    </div>
  );
};

export default ReadPatientData;
