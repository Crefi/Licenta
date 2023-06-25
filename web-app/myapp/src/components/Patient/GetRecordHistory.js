import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
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
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

const GetRecordHistory = () => {
  const patientId = localStorage.getItem('username');
  const [orgId, setOrg] = useState('');
  const [result, setResult] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/getRecordHistory', {
        id: 'admin',
        patientId: patientId,
        orgId: orgId
      });

      setResult(response.data);
      setError('');
    } catch (error) {
      console.error(error);
      setResult([]);
      setError('Error retrieving records.');
    }
  };

  useEffect(() => {
    if (result.length > 0) {
      const data = result.map((record, index) => (
        <TableRow key={index}>
          <TableCell>{record.PatientId}</TableCell>
          <TableCell>{record.Address}</TableCell>
          <TableCell>{record.Telephone}</TableCell>
          <TableCell>{record.Diagnosis}</TableCell>
          <TableCell>{record.Medication}</TableCell>
          <TableCell>{record.DoctorAuthorizationList.join(', ')}</TableCell>
          <TableCell>{record.OrganisationAuthorizationList.join(', ')}</TableCell>
          {/* Add more columns as needed */}
        </TableRow>
      ));
      setTableData(data);
    }
  }, [result]);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <Box sx={{ marginLeft: '280px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Get Record History
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Patient ID"
              variant="outlined"
              value={patientId}
              disabled
            />
            <TextField
              label="Org"
              variant="outlined"
              value={orgId}
              onChange={(e) => setOrg(e.target.value)}
            />
            <Button variant="contained" type="submit">Submit</Button>
          </form>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {tableData.length > 0 ? (
          <TableContainer component={Paper}>
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
        ) : (
          <Typography variant="body1" component="div">
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default GetRecordHistory;
