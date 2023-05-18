import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReadAllPatientData.css';

function ReadAllPatientData() {
  const [result, setResult] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'admin'; // Specify the desired user ID
        const orgId = 'Hospital1'; // Specify the desired organization ID
        const response = await axios.get('/getAllRecords', {
          params: { id: userId, orgId: orgId } // Pass the 'id' and 'orgId' as query parameters
        });
        setResult(JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error(error);
        setResult('Error retrieving patient records');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="table-container"> {/* Apply the 'table-container' class */}
      <h2>Get All Patient Records</h2>
      <pre className="table">{result}</pre> {/* Apply the 'table' class */}
    </div>
  );
}

export default ReadAllPatientData;
