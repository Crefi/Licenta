import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const AdminDashboard = () => {
  
  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
};

export default AdminDashboard;