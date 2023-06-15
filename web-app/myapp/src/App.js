import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import About from './Pages/About';
// import RevokeAccess from './components/Patient/RevokeAccess';
import GrantAccess from './components/Patient/GrantAccess';
import ApproveTransfer from './components/Patient/ApproveTransfer';
import Navbar from './components/Navbar/Navbar';
import GetRecordHistory from './components/Patient/GetRecordHistory';
import RegisterPatient from './components/Admin/RegisterPatient';
import AdminDashboard from './components/Admin/AdminDashboard';
import PatientDashboard from './components/Patient/PatientDashboard';
import DoctorDasboard from './components/Doctor/DoctorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar/Sidebar';
import ReadAllPatientData from './components/Patient/ReadAllPatientData';
import TransferRecord from './components/Doctor/TransferRecord';
import RegisterDoctor from './components/Admin/RegisterDoctor';
import ReadPaientData from './components/Doctor/ReadPatientData'

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        {/* Admin Routes */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/registerPatient" element={<RegisterPatient />} />
        <Route path="/registerDoctor" element={<RegisterDoctor/>} />
        <Route path="/readAllPatientData" element={<ReadAllPatientData />} />

        {/* Doctor Routes */}
        <Route path="/doctor-dashboard/*" element={<DoctorDasboard />} />
        <Route path="/transferRecord" element={<TransferRecord />} />
        <Route path="/readPatientData" element={<ReadPaientData />} />

        {/* Patient Routes */}
        <Route path="/patient-dashboard/*" element={<PatientDashboard />} />
        <Route path="/grantAccess" element={<GrantAccess />} />
        <Route path="/approveTransfer" element={<ApproveTransfer />} />
        <Route path="/getRecordHistory" element={<GetRecordHistory />} />


          
      
          <Route path="/sidebar" element={<Sidebar />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;