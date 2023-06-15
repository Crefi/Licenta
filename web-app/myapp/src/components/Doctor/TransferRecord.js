import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

function TransferRecord() {
  const [patientId, setPatientId] = useState('');
  const [newDoctorId, setNewDoctorId] = useState('');
  const [transferResult, setTransferResult] = useState('');

  const handleTransferRecord = async () => {
    try {
      const response = await axios.post('/transferRecord', {
        id: 'admin',
        patientId: patientId,
        newDoctorId: newDoctorId,
        orgId: 'Hospital1',
      });

      if (response.data.error) {
        setTransferResult(response.data.error);
      } else {
        setTransferResult('Record transferred successfully.');
      }
    } catch (error) {
      setTransferResult('An error occurred.');
    }
  };

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="container">
        <h2>Transfer Record</h2>
        <div className="form-group">
          <label>Patient ID:</label>
          <input
            type="text"
            className="form-control"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>New Doctor ID:</label>
          <input
            type="text"
            className="form-control"
            value={newDoctorId}
            onChange={(e) => setNewDoctorId(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className="btn btn-primary" onClick={handleTransferRecord}>
            Transfer Record
          </button>
        </div>
        <div className="result-container">
          {transferResult && <p>{transferResult}</p>}
        </div>
      </div>
    </div>
  );
}

export default TransferRecord;
