
import './App.css';
import React, { useState } from "react";
import {Login} from './components/Login'
import {Register} from './components/Register'
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';

import Navbar from './components/Navbar/Navbar';
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
      </Routes>
    </Router>
  );
}

  
  export default App;


