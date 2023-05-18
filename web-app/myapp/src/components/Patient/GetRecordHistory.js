import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import "./GetRecordHistory.css";

function GetRecordHistory() {
  const [id, setId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [orgId, setOrg] = useState('');
  const [result, setResult] = useState([]);
  const [tableData, setTableData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/getRecordHistory', {
        id: id,
        patientId: patientId,
        orgId: orgId
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult([]);
    }
  };

  useEffect(() => {
    if (result.length > 0) {
      const data = result.map((record, index) => (
        <tr key={index}>
          <td>{record.PatientId}</td>
          <td>{record.Address}</td>
          <td>{record.Telephone}</td>
          <td>{record.Diagnosis}</td>
          <td>{record.Medication}</td>
          <td>{record.DoctorAuthorizationList}</td>
          <td>{record.OrganisationAuthorizationList}</td>

          {/* Add more columns as needed */}
        </tr>
      ));
      setTableData(data);
    }
  }, [result]);

  return (
    <div>
      <Sidebar role={localStorage.getItem('role')} />
      <h2 class = "h2-history">Get Record History</h2>
      <form class = "form-history" onSubmit={handleSubmit}>
        <div>
          <label class = "label-history">ID:</label>
          <input class = "input-history"type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Patient ID:</label>
          <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <br />
        <div>
          <label>org:</label>
          <input type="text" value={orgId} onChange={(e) => setOrg(e.target.value)} />
        </div>
        <br />
        <button class = "button-history" type="submit">Submit</button>
      </form>
      <br />
      {tableData.length > 0 ? (
        <table class = "table-history">
          <thead class="thead-history">
            <tr class = "tr-history">
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
          <tbody class="tbody-history">{tableData}</tbody>
        </table>
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
}

export default GetRecordHistory;
