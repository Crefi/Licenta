import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Card from 'react-bootstrap/Card';
import { styled } from '@mui/system';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import "./AdminDashboard.css";

// Define a styled component for the cards
const StyledCard = styled(Card)({
  background: 'linear-gradient(to bottom, #66cc99, #1f5156)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
});

const AdminDashboard = () => {
  const [patients, setPatients] = useState(0);
  const [doctors, setDoctors] = useState(0);
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'admin'; // Specify the desired user ID
        const orgId = 'Hospital1'; // Specify the desired organization ID
        const response = await axios.get('/getAllCounts', {
          params: { id: userId, orgId: orgId } // Pass the 'id' and 'orgId' as query parameters
        });
        const { patients: totalPatients, doctors: totalDoctors } = response.data;
        setPatients(totalPatients || 0);
        setDoctors(totalDoctors || 0);
      } catch (error) {
        console.error(error);
        setPatients(0);
        setDoctors(0);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'admin'; // Specify the desired user ID
        const orgId = 'Hospital1'; // Specify the desired organization ID
        const response = await axios.get('/getAllRecords', {
          params: { id: userId, orgId: orgId } // Pass the 'id' and 'orgId' as query parameters
        });
        setResult(response.data);
      } catch (error) {
        console.error(error);
        setResult([]);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDropdownChange = async (event, patientId) => {
    setSelectedPatient(patientId);

    try {
      const response = await axios.post('/getRecordHistory', {
        id: "admin",
        patientId: patientId,
        orgId: "Hospital1"
      });
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      setHistory(null);
    }
  };

  const deletePatient = async (patientId) => {
    try {
      await axios.delete('/deletePatient', {
        data: {
          id: 'admin',
          patientId: patientId,
          orgId: 'Hospital1'
        }
      });
      // Refresh the patient records after deletion
      const response = await axios.get('/getAllRecords', {
        params: { id: 'admin', orgId: 'Hospital1' }
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, result.length - page * rowsPerPage);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="container">
        <h1 style={{ fontSize: '2rem', color: '#1f5156', fontWeight: 'bold', marginBottom: '20px' }}>
          Welcome to the admin dashboard!
        </h1>
      </div>
      <div className="row" style={{ marginLeft: '100px' }}>
        <div className="col-md-3">
          <StyledCard>
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text>Total Patients: {patients}</Card.Text>
            </Card.Body>
          </StyledCard>
        </div>
        <div className="col-md-3">
          <StyledCard>
            <Card.Body>
              <Card.Title>Doctors</Card.Title>
              <Card.Text>Total Doctors: {doctors}</Card.Text>
            </Card.Body>
          </StyledCard>
        </div>
        <div className="col-md-3">
          <StyledCard>
            <Card.Body>
              <Card.Title>Hospitals</Card.Title>
              <Card.Text>Total Hospitals: 2</Card.Text>
            </Card.Body>
          </StyledCard>
        </div>
      </div>

      <div className="table-container">
        <h2>Get All Patient Records</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PatientId</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Telephone ID</TableCell>
                <TableCell>Diagnosis ID</TableCell>
                <TableCell>Medication</TableCell>
                <TableCell>DoctorAuthorizationList</TableCell>
                <TableCell>OrganisationAuthorizationList</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : result
              ).map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.PatientId}</TableCell>
                  <TableCell>{record.Address}</TableCell>
                  <TableCell>{record.Telephone}</TableCell>
                  <TableCell>{record.Diagnosis}</TableCell>
                  <TableCell>{record.Medication}</TableCell>
                  <TableCell>{record.DoctorAuthorizationList.join(', ')}</TableCell>
                  <TableCell>{record.OrganisationAuthorizationList.join(', ')}</TableCell>
                  <TableCell>
                    <FormControl>
                      <Select
                        value={selectedPatient === record.PatientId ? 'selected' : ''}
                        onChange={(event) => handleDropdownChange(event, record.PatientId)}
                      >
                        <MenuItem value="">Select Action</MenuItem>
                        <MenuItem value="selected">View History</MenuItem>
                        <MenuItem
                          value="delete"
                          onClick={() => deletePatient(record.PatientId)}
                        >
                          Delete Patient
                        </MenuItem>
                       
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={result.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {history && (
        <div className="history-container">
          <h2>Patient History</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PatientId</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Telephone ID</TableCell>
                  <TableCell>Diagnosis ID</TableCell>
                  <TableCell>Medication</TableCell>
                  <TableCell>DoctorAuthorizationList</TableCell>
                  <TableCell>OrganisationAuthorizationList</TableCell>
                  {/* Add more table headers for history details */}
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.PatientId}</TableCell>
                    <TableCell>{record.Address}</TableCell>
                    <TableCell>{record.Telephone}</TableCell>
                    <TableCell>{record.Diagnosis}</TableCell>
                    <TableCell>{record.Medication}</TableCell>
                    <TableCell>{record.DoctorAuthorizationList.join(', ')}</TableCell>
                    <TableCell>{record.OrganisationAuthorizationList.join(', ')}</TableCell>
                    {/* Add more table cells for history details */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
