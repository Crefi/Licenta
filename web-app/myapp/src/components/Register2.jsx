import { useState } from "react";
import axios from "axios";
import AuthService from "./Auth/Auth";

function Register2() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Doctor");
  const [id, setId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [org, setOrg] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medication, setMedication] = useState("");

  const _auth = new AuthService();

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      username: username,
      role: selectedRole,
      id: id,
      doctorId: doctorId,
      org: org,
      address: address,
      tel: tel,
      patientId: patientId,
      medication: medication,
      diagnosis: diagnosis,
    };
    axios.post(`http://localhost:5001/register${selectedRole}`, payload, {
      headers: {
        Authorization: `Bearer ${_auth.getToken()}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        alert(JSON.stringify(res.data));
        window.location.reload();
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };
  const isUserLogin = () => {
    if (_auth.getToken() != null) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  const checkIsAdmin = () => {
    setIsAdmin(_auth.isUserAdmin());
  };

  const getUsername = () => {
    setUsername(_auth.getUserDetails("username"));
  };

  return (
    <>
      {!isAdmin ? (
        <div className="col-md-4 offset-4 mt-5">
          <h5>Please Log in as admin</h5>
        </div>
      ) : (
        <div className="col-md-4 offset-4 mt-5 posFixed">
          <p>Register</p>
          <form
            onSubmit={onSubmit}
            encType="application/x-www-form-urlencoded"
          >
            <div className="form-group posFixed">
              <label htmlFor="role">Role:</label>
              <select
                className="form-control"
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>

              <label htmlFor="id">Id:</label>
              <input
                className="form-control"
                name="id"
                placeholder="Id"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />

              <label htmlFor="doctorId">Doctor Id:</label>
              <input
                className="form-control"
                name="doctorId"
                placeholder="Doctor Id"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />

            <label htmlFor="org">Organization:</label>
            <input
            className="form-control"
            name="org"
            placeholder="Organization"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            />

          <label htmlFor="address">Address:</label>
          <input
            className="form-control"
            name="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {selectedRole === "Doctor" ? (
            <>
              <label htmlFor="tel">Tel:</label>
              <input
                className="form-control"
                name="tel"
                placeholder="Telephone"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
            </>
          ) : (
            <>
              <label htmlFor="patientId">Patient Id:</label>
              <input
                className="form-control"
                name="patientId"
                placeholder="Patient Id"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />

              <label htmlFor="diagnosis">Diagnosis:</label>
              <input
                className="form-control"
                name="diagnosis"
                placeholder="Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />

              <label htmlFor="medication">Medication:</label>
              <input
                className="form-control"
                name="medication"
                placeholder="Medication"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
              />
            </>
          )}
          <button className="btn btn-primary mt-3" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  )}
</>
);
}

export default Register2;