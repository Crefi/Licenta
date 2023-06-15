import React, { useState } from 'react';
import axios from 'axios';
import signupSvg from '../Images/signup.svg';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [orgId, setOrganization] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/register', {
        username,
        password,
        role,
        orgId,
      });

      try {
        await axios.post(`/enrollUser`, { username });
        console.log(`Successfully enrolled user ${username}`);
      } catch (error) {
        console.error(`Failed to enroll user ${username}: ${error}`);
      }
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('role', response.data.rol);
      window.location.href = './Login'; // Replace with your dashboard page URL

    } catch (error) {
      alert('Unable to register, please try again');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={signupSvg} alt="Signup" className="img-fluid" />
        </div>
        <div className="col-md-6">
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
              <input
                type="text"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Select Organization:</label>
              <select
                className="form-control"
                value={orgId}
                onChange={(e) => setOrganization(e.target.value)}
              >
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
