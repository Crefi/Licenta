import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReadAllPatientData.css';
import Sidebar from '../Sidebar/Sidebar';

function ReadAllPatientData() {
  const [result, setResult] = useState([]);

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
}

export default ReadAllPatientData;
