import React, { useState } from "react";
import './Login.css';

export const Register = (props) => {
    const [role, setRole] = useState('');
    const [hospital, setHospital] = useState('');
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
    }

    return (
        <div id="login-page" className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="Role">Role</label>
                <input value={role} onChange={(e) => setRole(e.target.value)}type="text" placeholder="User" id="role" name="role" />
                <label htmlFor="Hospital">Hospital</label>
                <input value={hospital} onChange={(e) => setHospital(e.target.value)}type="text" placeholder="Hospital1" id="hospital" name="hospital" />
                <label htmlFor="Username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder="Username" id="username" name="username" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
    </div>
    )
}