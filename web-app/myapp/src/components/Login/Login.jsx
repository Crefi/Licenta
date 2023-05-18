import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import Sidebar from '../Sidebar/Sidebar';

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
    <div>
      <h1 className="h1-login">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label className="label-login">Username:</label>
          <input className="input-login" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="label-login">Password:</label>
          <input className="input-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="button-login" type="submit">Login</button>
      </form>
      {isAuthenticated && <Sidebar role={localStorage.getItem('role')} />}
      
    </div>
  );
};


export default Login;
