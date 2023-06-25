import React from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaUserPlus, FaUserMd, FaUserCircle, FaExchangeAlt, FaHistory, FaUserLock, FaCheckCircle } from 'react-icons/fa';

export const getSidebarData = (role) => {
  let sidebarData = []; 
  if (role === 'admin') {
    sidebarData.push(
      {
        title: 'AdminDashboard',
        path: '/admin-dashboard',
        icon: <AiOutlineDashboard />,
        cName: 'side-nav-text'
      },
      {
        title: 'RegisterPatient',
        path: '/registerPatient',
        icon: <FaUserPlus />,
        cName: 'side-nav-text'
      },
      {
        title: 'RegisterDoctor',
        path: '/registerDoctor',
        icon: <FaUserMd />,
        cName: 'side-nav-text'
      },
   
    );
  } else if (role === 'doctor') {
    sidebarData.push(
      {
        title: 'DoctorDashboard',
        path: '/doctor-Dashboard',
        icon: <AiOutlineDashboard />,
        cName: 'side-nav-text'
      },
      {
        title: 'RegisterPatient',
        path: '/registerPatient',
        icon: <FaUserPlus />,
        cName: 'side-nav-text'
      },
      {
        title: 'TransferRecord',
        path: '/transferRecord',
        icon: <FaExchangeAlt />,
        cName: 'side-nav-text'
      },
      {
        title: 'ReadPatientData',
        path: '/readPatientData',
        icon: <FaUserCircle />,
        cName: 'side-nav-text'
      },
      {
        title: 'UpdatePatientInfo',
        path: '/updatePatient',
        icon: <FaUserCircle />,
        cName: 'side-nav-text'
      },
    );
    
  } else if (role === 'patient') {
    sidebarData.push(
      {
        title: 'PatientDashboard',
        path: '/patient-dashboard',
        icon: <AiOutlineDashboard />,
        cName: 'side-nav-text'
      },
      {
        title: 'GetRecordHistory',
        path: '/getRecordHistory',
        icon: <FaHistory />,
        cName: 'side-nav-text'
      },
      {
        title: 'GrantAccess',
        path: '/grantAccess',
        icon: <FaUserLock />,
        cName: 'side-nav-text'
      },
      {
        title: 'ApproveTransfer',
        path: '/approveTransfer',
        icon: <FaCheckCircle />,
        cName: 'side-nav-text'
      },
    );
    
  }

  return sidebarData;
};
