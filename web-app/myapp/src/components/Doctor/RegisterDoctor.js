import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

const RegisterDoctor = () => {
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
        'http://localhost:5001/registerDoctor',
        {
          id,
          patientId,
          address,
          telephone,
          diagnosis,
          medication,
          doctorId,
          orgId,
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
      <Sidebar role={localStorage.getItem('role')} />
      <div className="container">
        <h1>Register Patient</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Id:</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Patient ID:</label>
            <input
              type="text"
              className="form-control"
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Org:</label>
            <input
              type="text"
              className="form-control"
              value={orgId}
              onChange={(event) => setOrg(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Telephone:</label>
            <input
              type="text"
              className="form-control"
              value={telephone}
              onChange={(event) => setTelephone(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Diagnosis:</label>
            <input
              type="text"
              className="form-control"
              value={diagnosis}
              onChange={(event) => setDiagnosis(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Medication:</label>
            <input
              type="text"
              className="form-control"
              value={medication}
              onChange={(event) => setMedication(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Doctor ID:</label>
            <input
              type="text"
              className="form-control"
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegisterDoctor;
