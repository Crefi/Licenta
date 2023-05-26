import React, { useState } from 'react';
import axios from 'axios';
import './GrantAccess.css';
import Sidebar from '../Sidebar/Sidebar';

function GrantAccess() {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [grantAccessResult, setGrantAccessResult] = useState('');
  const [revokeAccessResult, setRevokeAccessResult] = useState('');

  const handleGrantAccess = async () => {
    try {
      const response = await axios.post('/grantAccess', {
        id: "admin",
        patientId: patientId,
        doctorId: doctorId,
        orgId:"Hospital1",
      });

      if (response.data.error) {
        setGrantAccessResult(response.data.error);
      } else {
        setGrantAccessResult('Access granted successfully.');
      }
    } catch (error) {
      setGrantAccessResult('An error occurred.');
    }
  };

  const handleRevokeAccess = async () => {
    try {
      const response = await axios.post('/revokeAccess', {
        id: "admin",
        patientId: patientId,
        doctorId: doctorId,
        orgId:"Hospital1",
      });

      if (response.data.error) {
        setRevokeAccessResult(response.data.error);
      } else {
        setRevokeAccessResult('Access revoked successfully.');
      }
    } catch (error) {
      setRevokeAccessResult('An error occurred.');
    }
  };

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="container">
        <h2>Grant/Revoke Access</h2>
        <div className="form-group">
          <label>Patient ID:</label>
          <input type="text" className="form-control" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Doctor ID:</label>
          <input type="text" className="form-control" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        </div>
        <div className="button-container">
          <button className="btn btn-primary" onClick={handleGrantAccess}>Grant Access</button>
          <button className="btn btn-danger" onClick={handleRevokeAccess}>Revoke Access</button>
        </div>
        <div className="result-container">
          {grantAccessResult && <p>{grantAccessResult}</p>}
          {revokeAccessResult && <p>{revokeAccessResult}</p>}
        </div>
      </div>
    </div>
  );
}

export default GrantAccess;
