import React, { useState } from 'react';
import axios from 'axios';
import signupSvg from '../Images/signup.svg';
import Alert from '@mui/material/Alert';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [orgId, setOrganization] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/register', {
        username,
        password,
        role,
        orgId,
      });


      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('role', response.data.rol);
      window.location.href = './Login'; // Replace with your dashboard page URL

    } catch (error) {
      setErrorMessage('Unable to register, please try again');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={signupSvg} alt="Signup" className="img-fluid" />
        </div>
        <div className="col-md-6">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="mb-3">
              <label className="form-label">Username:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Select Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select an role</option>
                <option value="admin">admin</option> 
                <option value="doctor">doctor</option>
                <option value="patient">patient</option> 
 
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Organization:</label>
              <select
                className="form-control"
                value={orgId}
                onChange={(e) => setOrganization(e.target.value)}
              >
                <option value="">Select an organization</option>
                <option value="Hospital1">Hospital1</option> 
                <option value="Hospital2">Hospital2</option> 
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
