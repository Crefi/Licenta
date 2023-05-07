import React, { useState } from 'react';
import axios from 'axios';

const GrantAccess = () => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/grantAccess', {
        patientId,
        doctorId,
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
          Patient ID:
          <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </label>
        <br />
        <label>
          Doctor ID:
          <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        </label>
        <br />
        <button type="submit">Grant Access</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default GrantAccess;
