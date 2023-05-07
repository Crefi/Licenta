import React, { useState } from 'react';
import axios from 'axios';

function GetRecordHistory() {
  const [patientId, setPatientId] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/getRecordHistory', {
        patientId: patientId,
      });

      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(error);
      setResult('Error retrieving record history');
    }
  };

  return (
    <div>
      <h2>Get Record History</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient ID:</label>
          <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />
      <pre>{result}</pre>
    </div>
  );
}

export default GetRecordHistory;
