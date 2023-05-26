import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const DoctorDashboard = () => {
  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <h1>Doctor Dashboard</h1>
      <p>Welcome to the doctor dashboard!</p>
    </div>
  );
};

export default DoctorDashboard;