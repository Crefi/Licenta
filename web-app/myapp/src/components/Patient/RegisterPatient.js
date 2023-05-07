import React, { useState } from 'react';
import axios from 'axios';

const RegisterPatient = () => {
  const [patientId, setPatientId] = useState('');
  const [id, setId] = useState('');
  const [organization, setOrg] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5001/registerPatient',
        {
          id,
          patientId,
          organization,
          address,
          telephone,
          diagnosis,
          medication,
          doctorId,
          role,
          username
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        // Redirect to the success page
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Register Patient</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Patient ID:
          <input
            type="text"
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
        <br />
        <label>
          Telephone:
          <input
            type="text"
            value={telephone}
            onChange={(event) => setTelephone(event.target.value)}
          />
        </label>
        <br />
        <label>
          Org:
          <input
            type="text"
            value={organization}
            onChange={(event) => setOrg(event.target.value)}
          />
        </label>
        <br />
        <label>
          Id:
          <input
            type="text"
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
        </label>
        <br />
        <label>
          Diagnosis:
          <input
            type="text"
            value={diagnosis}
            onChange={(event) => setDiagnosis(event.target.value)}
          />
        </label>
        <br />
        <label>
          Medication:
          <input
            type="text"
            value={medication}
            onChange={(event) => setMedication(event.target.value)}
          />
        </label>
        <br />
        <label>
          Doctor ID:
          <input
            type="text"
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
          />
        </label>
        <br />
        <label>
           Role:
          <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </label>
        <br />
        <label>
           username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default RegisterPatient;