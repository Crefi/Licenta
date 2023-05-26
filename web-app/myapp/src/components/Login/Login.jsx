import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Sidebar from '../Sidebar/Sidebar';
import loginSvg from '../Images/login.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/login', { username, password });
      const { accessToken, role } = response.data;

      // Store the access token and role in local storage or cookies
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);

      // Update authentication status
      setIsAuthenticated(true);

      // Redirect the user based on their role
      if (role === 'patient') {
        navigate('/patient-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor-dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={loginSvg} alt="Login" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h1 className="h1-login">Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="label-login">Username:</label>
              <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="label-login">Password:</label>
              <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
        </div>
      </div>
      {isAuthenticated && <Sidebar role={localStorage.getItem('role')} />}
    </div>
  );
};

export default Login;
