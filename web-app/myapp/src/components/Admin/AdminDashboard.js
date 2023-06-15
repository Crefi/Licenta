import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Card from 'react-bootstrap/Card';
import TablePagination from '@mui/material/TablePagination';
import "./AdminDashboard.css"
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

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, result.length - page * rowsPerPage);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
      <div className="row">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text>Total Patients: {patients}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Doctors</Card.Title>
              <Card.Text>Total Doctors: {doctors}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Hospitals</Card.Title>
              <Card.Text>Total Hospitals: 2</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="table-container">
        <h2>Get All Patient Records</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>PatientId</th>
              <th>Address</th>
              <th>Telephone ID</th>
              <th>Diagnosis ID</th>
              <th>Medication</th>
              <th>DoctorAuthorizationList</th>
              <th>OrganisationAuthorizationList</th>
              <th>Actions</th> {/* New column for the dropdown button */}
              {/* Add more table headers based on your JSON structure */}
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : result
            ).map((record, index) => (
              <tr key={index}>
                <td>{record.PatientId}</td>
                <td>{record.Address}</td>
                <td>{record.Telephone}</td>
                <td>{record.Diagnosis}</td>
                <td>{record.Medication}</td>
                <td>{record.DoctorAuthorizationList.join(', ')}</td>
                <td>{record.OrganisationAuthorizationList.join(', ')}</td>
                <td>
                  <select
                    value={selectedPatient === record.PatientId ? 'selected' : ''}
                    onChange={(event) => handleDropdownChange(event, record.PatientId)}
                  >
                    <option value="">Select Action</option>
                    <option value="selected">View History</option>
                  </select>
                </td>
                {/* Add more table cells based on your JSON structure */}
              </tr>
            ))}

            {emptyRows > 0 && (
              <tr style={{ height: 53 * emptyRows }}>
                <td colSpan={8} />
              </tr>
            )}
          </tbody>
        </table>

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
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>PatientId</th>
          <th>Address</th>
          <th>Telephone ID</th>
          <th>Diagnosis ID</th>
          <th>Medication</th>
          <th>DoctorAuthorizationList</th>
          <th>OrganisationAuthorizationList</th>
          {/* Add more table headers for history details */}
        </tr>
      </thead>
      <tbody>
        {history.map((record, index) => (
          <tr key={index}>
            <td>{record.PatientId}</td>
            <td>{record.Address}</td>
            <td>{record.Telephone}</td>
            <td>{record.Diagnosis}</td>
            <td>{record.Medication}</td>
            <td>{record.DoctorAuthorizationList.join(', ')}</td>
            <td>{record.OrganisationAuthorizationList.join(', ')}</td>
            {/* Add more table cells for history details */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      )}
    </div>
  );
};

export default AdminDashboard;