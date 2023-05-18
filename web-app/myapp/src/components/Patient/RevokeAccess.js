import React, { useState } from 'react';
import axios from 'axios';

const RevokeAccess = () => {
  const [id, setId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [orgId, setOrg] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/revokeAccess', {
        id,
        patientId,
        doctorId,
        orgId,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  return (
    <div>
      <h2>Grant Access</h2>
      <form onSubmit={handleSubmit}>
      <label>
          Patient role:
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </label>
        <br />
        <label>
          Patient ID:
          <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </label>
        <br />
        <label>
          Doctor ID:
          <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        </label>
        <br />
        <label>
          Patient organization:
          <input type="text" value={orgId} onChange={(e) => setOrg(e.target.value)} />
        </label>
        <br />
        <button type="submit">Grant Access</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RevokeAccess;
