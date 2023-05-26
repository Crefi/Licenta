import React from 'react';
import "../components/Images/med.svg";

function Home() {
  return (
    <div className='home'>
      <div className="row">
        <div className="col-md-6">
          <img src={require("../components/Images/med.svg").default} className="img-fluid" alt="Med" />
        </div>
        <div className="col-md-6">
          <h1> Uvt Med hyperledger fabric blockchain app</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
