import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Card from 'react-bootstrap/Card';

const PatientDashboard = () => {
  const [result, setResult] = useState(null); // Initialize result state to null
  const [successMessage, setSuccessMessage] = useState('');

  const [hasProfile, setHasProfile] = useState(false);
  const [showInputs, setShowInputs] = useState(false); // Track the visibility of input fields
  const [formData, setFormData] = useState({
    id: 'admin',
    patientId: '',
    address: '',
    telephone: '',
    diagnosis: '',
    medication: '',
    doctorId: '',
    orgId: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'admin'; // Specify the desired user ID
        const orgId = 'Hospital1'; // Specify the desired organization ID
        const patientId = 'Patient1'; // Specify the desired organization ID
        const response = await axios.get('/readPatientData', {
          params: { id: userId,patientId: patientId, orgId: orgId } // Pass the 'id' and 'orgId' as query parameters
        });
        setResult(response.data);
      } catch (error) {
        console.error(error);
        setResult([]);
      }
    };

    fetchData();
  }, []);

  const handleCreateProfile = async () => {
    setShowInputs(true); // Show the input fields when the button is clicked
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/registerPatient', formData);
  
      setHasProfile(true);
      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        setSuccessMessage('Patient profile created successfully!' ); // Set the success message
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <div className="card-container">
        <h2>Get Patient Record</h2>
        
        <div className="row">
          {result ? ( // Check if result is not null
            <div className="col-md-4">
              <Card>
                <Card.Body>
                  <Card.Title>Patient ID: {result.PatientId}</Card.Title>
                  <Card.Text>Address: {result.Address}</Card.Text>
                  <Card.Text>Telephone ID: {result.Telephone}</Card.Text>
                  <Card.Text>Diagnosis ID: {result.Diagnosis}</Card.Text>
                  <Card.Text>Medication: {result.Medication}</Card.Text>
                  <Card.Text>
                    Doctor Authorization List:{' '}
                    {result.DoctorAuthorizationList.join(', ')}
                  </Card.Text>
                  <Card.Text>
                    Organisation Authorization List:{' '}
                    {result.OrganisationAuthorizationList.join(', ')}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <div>No patient records found.</div>
          )}
        </div>
        {!hasProfile && !showInputs && (
          <button className="btn btn-primary" onClick={handleCreateProfile}>
            Create Patient Profile
          </button>
        )}
        {showInputs && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              placeholder="Patient ID"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              placeholder="Telephone"
              required
            />
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              placeholder="Diagnosis"
              required
            />
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleInputChange}
              placeholder="Medication"
              required
            />
            <input
              type="text"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              placeholder="Doctor ID"
              required
            />
            <input
              type="text"
              name="orgId"
              value={formData.orgId}
              onChange={handleInputChange}
              placeholder="Organization ID"
              required
            />
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        )}
        {errorMessage && <div>Error: {errorMessage}</div>}
      </div>
    </div>
  );
};

export default PatientDashboard;
