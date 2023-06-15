import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const getSidebarData = (role) => {
  let sidebarData = []; 
  if (role === 'admin') {
    sidebarData.push(
      {
        title: 'AdminDashboard',
        path: '/admin-dashboard',
        icon: <FaIcons.FaUser />,
        cName: 'side-nav-text'
      },
      {
        title: 'RegisterPatient',
        path: '/registerPatient',
        icon: <FaIcons.FaUser />,
        cName: 'side-nav-text'
      },
      // Other admin-specific sidebar items
    );
  } else if (role === 'doctor') {
    sidebarData.push(
      {
        title: 'DoctorDashboard',
        path: '/doctor-Dashboard',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'RegisterDoctor',
        path: '/registerDoctor',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'TransferRecord',
        path: '/transferRecord',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'ReadPatientData',
        path: '/readPatientData',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
    );
    
  } else if (role === 'patient') {
    sidebarData.push(
      {
        title: 'PatientDashboard',
        path: '/patient-dashboard',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'GetRecordHistory',
        path: '/getRecordHistory',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'GrantAccess',
        path: '/grantAccess',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'ReadAllPatientData',
        path: '/readAllPatientData',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'ApproveTransfer',
        path: '/approveTransfer',
        icon: <FaIcons.FaUserCircle />,
        cName: 'side-nav-text'
      },
      // Other user-specific sidebar items
    );
    
  }

  return sidebarData;
};
