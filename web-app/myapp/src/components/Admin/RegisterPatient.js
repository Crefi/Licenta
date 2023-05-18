import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

const RegisterPatient = () => {
  const [id, setId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [orgId, setOrg] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5001/registerPatient',
        {
          id,
          patientId,
          address,
          telephone,
          diagnosis,
          medication,
          doctorId,
          orgId,
    
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        // }
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
      <Sidebar role={localStorage.getItem('role')} />
      <h1>Register Patient</h1>
      <form onSubmit={handleSubmit}>
      <label>
          Id:
          <input
            type="text"
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
        </label>
        <br></br>
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
          Org:
          <input
            type="text"
            value={orgId}
            onChange={(event) => setOrg(event.target.value)}
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
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default RegisterPatient;