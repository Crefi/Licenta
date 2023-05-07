import React, { useState } from "react";
import axios from "axios";

function Test() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleInitClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/initialize",
        {
          firstName: input,
        }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGrantAccessClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/grantAccess",
        {
          patientId: "1234",
          doctorId: "5678",
        }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetRecordClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/getRecord",
        {
          patientId: "1234",
        }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetHistoryClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/getRecordHistory",
        {
          patientId: "1234",
        }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Test">
      <h1>Blockchain Medical Record</h1>
      <label htmlFor="input">Enter First Name:</label>
      <input id="input" type="text" value={input} onChange={handleInputChange} />
      <br />
      <button onClick={handleInitClick}>Initialize Record</button>
      <button onClick={handleGrantAccessClick}>Grant Access</button>
      <button onClick={handleGetRecordClick}>Get Record</button>
      <button onClick={handleGetHistoryClick}>Get Record History</button>
      <br />
      <p>{response}</p>
    </div>
  );
}

export default Test;
