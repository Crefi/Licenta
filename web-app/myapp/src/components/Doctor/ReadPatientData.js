import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Patient/GrantAccess.css';
import Sidebar from '../Sidebar/Sidebar';

function ReadPatientData() {
  const [patientId, setPatientId] = useState('');
  const [result, setResult] = useState({});
  const [tableData, setTableData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/readPatientData', {
        id: "admin",
        patientId: patientId,
        orgId: "Hospital1"
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({});
    }
  };

  useEffect(() => {
    if (Object.keys(result).length > 0) {
      const data = [
        {
          ...result,
          DoctorAuthorizationList: [result.DoctorAuthorizationList],
          OrganisationAuthorizationList: [result.OrganisationAuthorizationList]
        }
      ];
      const tableData = data.map((record, index) => (
        <tr key={index}>
          <td>{record.PatientId}</td>
          <td>{record.Address}</td>
          <td>{record.Telephone}</td>
          <td>{record.Diagnosis}</td>
          <td>{record.Medication}</td>
          <td>{record.DoctorAuthorizationList.join(", ")}</td>
          <td>{record.OrganisationAuthorizationList.join(", ")}</td>
          {/* Add more columns as needed */}
        </tr>
      ));
      setTableData(tableData);
    }
  }, [result]);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <h2>Get Patient Data</h2>
      <form onSubmit={handleSubmit}>
        <br />
        <div className="form-group">
          <label>Patient ID:</label>
          <input className="form-control" type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
      <br />
      {tableData.length > 0 ? (
        <table className="table table-bordered table-history">
          <thead className="thead-dark">
            <tr>
              <th>PatientId</th>
              <th>Address</th>
              <th>Telephone ID</th>
              <th>Diagnosis ID</th>
              <th>Medication</th>
              <th>DoctorAuthorizationList</th>
              <th>OrganisationAuthorizationList</th>
              {/* Add more column headers as needed */}
            </tr>
          </thead>
          <tbody>{tableData}</tbody>
        </table>
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
}

export default ReadPatientData;