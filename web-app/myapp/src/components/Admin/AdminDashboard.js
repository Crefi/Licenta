import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Card from 'react-bootstrap/Card';

const AdminDashboard = () => {
  const [patients, setPatients] = useState(0);
  const [doctors, setDoctors] = useState(0);
  const [result, setResult] = useState([]);

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

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>

      <div className="row">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text>
                Total Patients: {patients}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Doctors</Card.Title>
              <Card.Text>
                Total Doctors: {doctors}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Hospitals</Card.Title>
              <Card.Text>
                Total Hospitals: 2
              </Card.Text>
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
              {/* Add more table headers based on your JSON structure */}
            </tr>
          </thead>
          <tbody>
            {result.map((record, index) => (
              <tr key={index}>
                <td>{record.PatientId}</td>
                <td>{record.Address}</td>
                <td>{record.Telephone}</td>
                <td>{record.Diagnosis}</td>
                <td>{record.Medication}</td>
                <td>{record.DoctorAuthorizationList.join(', ')}</td>
                <td>{record.OrganisationAuthorizationList.join(', ')}</td>
                {/* Add more table cells based on your JSON structure */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
