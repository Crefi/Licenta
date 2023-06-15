import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';


function ApproveTransfer() {
  const [patientId, setPatientId] = useState('');
  const [newDoctorId, setDoctorId] = useState('');
  const [approveTransferResult, setApproveTransferResult] = useState('');


  const handleApproveTranfer = async () => {
    try {
      const response = await axios.post('/approveTransfer', {
        id: "admin",
        patientId: patientId,
        newDoctorId: newDoctorId,
        orgId:"Hospital1",
      });

      if (response.data.error) {
        setApproveTransferResult(response.data.error);
      } else {
        setApproveTransferResult('Approve granted successfully.');
      }
    } catch (error) {
        setApproveTransferResult('An error occurred.');
    }
  };


  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="container">
        <h2>Approve Transfer </h2>
        <div className="form-group">
          <label>Patient ID:</label>
          <input type="text" className="form-control" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Approve New Doctor:</label>
          <input type="text" className="form-control" value={newDoctorId} onChange={(e) => setDoctorId(e.target.value)} />
        </div>
        <div className="button-container">
          <button className="btn btn-primary" onClick={handleApproveTranfer}>ApproveTransfer</button>
        
        </div>
        <div className="result-container">
          {approveTransferResult && <p>{approveTransferResult}</p>}

        </div>
      </div>
    </div>
  );
}

export default ApproveTransfer;
