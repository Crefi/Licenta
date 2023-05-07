import React, { useState } from 'react';
import axios from 'axios';

function RevokeAccess() {
  const [doctorUsername, setDoctorUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://localhost:5001/revokeAccess', {
        doctorUsername: doctorUsername,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Access revoked successfully!');
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  }

  return (
    <div>
      <h1>Revoke Access</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor's username:</label>
          <input type="text" onChange={(e) => setDoctorUsername(e.target.value)} />
        </div>
        <button type="submit">Revoke Access</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default RevokeAccess;
