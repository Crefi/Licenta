import React, { useState } from 'react';
import axios from 'axios';

function RegisterRecord() {
  const [patientId, setPatientId] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [healthRecordId, setHealthRecordId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [doctorAuthorizationList, setDoctorAuthorizationList] = useState([]);
  const [organisationAuthorizationList, setOrganisationAuthorizationList] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/records', {
        patientId,
        address,
        telephone,
        healthRecordId,
        diagnosis,
        medication,
        doctorAuthorizationList,
        organisationAuthorizationList,
      });
      console.log(response);
      alert('Record registered successfully!');
    } catch (error) {
      console.error(error);
      alert('Error registering record. Please try again later.');
    }
  };

  const handleDoctorAuthorizationListChange = (event) => {
    setDoctorAuthorizationList(Array.from(event.target.selectedOptions, (option) => option.value));
  };

  const handleOrganisationAuthorizationListChange = (event) => {
    setOrganisationAuthorizationList(Array.from(event.target.selectedOptions, (option) => option.value));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="patientId">Patient ID:</label>
        <input type="text" id="patientId" value={patientId} onChange={(event) => setPatientId(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input type="text" id="address" value={address} onChange={(event) => setAddress(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="telephone">Telephone:</label>
        <input type="text" id="telephone" value={telephone} onChange={(event) => setTelephone(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="healthRecordId">Health Record ID:</label>
        <input type="text" id="healthRecordId" value={healthRecordId} onChange={(event) => setHealthRecordId(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="diagnosis">Diagnosis:</label>
        <input type="text" id="diagnosis" value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="medication">Medication:</label>
        <input type="text" id="medication" value={medication} onChange={(event) => setMedication(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="doctorAuthorizationList">Doctor Authorization List:</label>
        <select multiple id="doctorAuthorizationList" value={doctorAuthorizationList} onChange={handleDoctorAuthorizationListChange} required>
          <option value="Doc1">Doc1</option>
          <option value="Doc2">Doc2</option>
          <option value="Doc3">Doc3</option>
        </select>
      </div>
      <div>
       
    <label htmlFor="organisationAuthorizationList">Organisation Authorization List:</label>
    <select multiple id="organisationAuthorizationList" value={organisationAuthorizationList} onChange={handleOrganisationAuthorizationListChange} required>
      <option value="Hospital1">Hospital1</option>
      <option value="Hospital2">Hospital2</option>
      <option value="Hospital3">Hospital3</option>
    </select>
  </div>
  <button type="submit">Register Record</button>
</form>
);
}

export default RegisterRecord;