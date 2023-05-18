import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const PatientDashboard = () => {
  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <h1>Patient Dashboard</h1>
      <p>Welcome to the Patient dashboard!</p>
    </div>
  );
};

export default PatientDashboard;
