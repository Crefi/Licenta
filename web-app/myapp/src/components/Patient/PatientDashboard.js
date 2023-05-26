import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Card from 'react-bootstrap/Card';
const PatientDashboard = () => {
  const [result, setResult] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userId = 'admin'; // Specify the desired user ID
  //       const orgId = 'Hospital1'; // Specify the desired organization ID
  //       const response = await axios.get('/getAllRecords', {
  //         params: { id: userId, orgId: orgId } // Pass the 'id' and 'orgId' as query parameters
  //       });
  //       setResult(response.data);
  //     } catch (error) {
  //       console.error(error);
  //       setResult([]);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="card-container">
        <h2>Get All Patient Records</h2>
        <div className="row">
          {result.map((record, index) => (
            <div key={index} className="col-md-4">
              <Card>
                <Card.Body>
                  <Card.Title>Patient ID: {record.PatientId}</Card.Title>
                  <Card.Text>Address: {record.Address}</Card.Text>
                  <Card.Text>Telephone ID: {record.Telephone}</Card.Text>
                  <Card.Text>Diagnosis ID: {record.Diagnosis}</Card.Text>
                  <Card.Text>Medication: {record.Medication}</Card.Text>
                  <Card.Text>
                    Doctor Authorization List:{' '}
                    {record.DoctorAuthorizationList.join(', ')}
                  </Card.Text>
                  <Card.Text>
                    Organisation Authorization List:{' '}
                    {record.OrganisationAuthorizationList.join(', ')}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
