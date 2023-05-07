import { useState } from "react";
import { useEffect } from "react";

function AuthService() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);

  

  const getUserDetails = (variableName) => {
    return localStorage.getItem(variableName);
  };

  const setDataInLocalStorage = (variableName, data) => {
    localStorage.setItem(variableName, data);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const clearStorage = () => {
    localStorage.clear();
  };

  const isUserAdmin = () => {
    if (getUserDetails("userData") === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const isUserDoctor = () => {
    if (getUserDetails("userData") === "doctor") {
      setIsDoctor(true);
    } else {
      setIsDoctor(false);
    }
  };

  const isUserPatient = () => {
    if (getUserDetails("userData") === "patient") {
      setIsPatient(true);
    } else {
      setIsPatient(false);
    }
  };

  useEffect(() => {
    isUserAdmin();
    isUserDoctor();
    isUserPatient();
  }, []);

  return {
    isAdmin,
    isDoctor,
    isPatient,
    getUserDetails,
    setDataInLocalStorage,
    getToken,
    clearStorage,
  };
}

export default AuthService;
