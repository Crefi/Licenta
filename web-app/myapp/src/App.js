
import './App.css';
import React, { useState } from "react";
import Login from './components/Login'
import Register from './components/Register'
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import RevokeAccess from './components/Patient/RevokeAccess';
import GrantAccess from './components/Patient/GrantAccess';
import RegisterRecord from './components/Patient/Record';
import ReadAllPatientData from './components/Patient/ReadAllPatientData';
import Navbar from './components/Navbar/Navbar';
import Test from './components/Patient/Test';
import GetRecordHistory from './components/Patient/GetRecordHistory';
import RegisterPatient from './components/Patient/RegisterPatient';
// import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  return (
    <>
      <Navbar />
      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login id="login-page" />} />
        <Route path="/register" element={<Register id="login-page" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/revokeAccess" element={<RevokeAccess />} />
        <Route path="/grantAccess" element={<GrantAccess />} />
        <Route path="/registerRecord" element={<RegisterRecord />} />
        <Route path="/registerPatient" element={<RegisterPatient />} />
        <Route path="/getRecordHistory" element={<GetRecordHistory/>} />
        
        <Route path="/test" element={<Test/>} />

      </Routes>
    </Router>
  );
}

  
  export default App;


