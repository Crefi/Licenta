import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check the login status when the component mounts
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    setIsLoggedIn(accessToken ? true : false);
    setUserRole(role);
  }, []);

  const handleClick = () => setClick(!click);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            UVT-Med
            <i className="fas fa-code"></i>
          </NavLink>

          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/logout"
                    className="nav-links"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            )}

    <li className="nav-item">
                  <NavLink
                    exact
                    to="/about"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    About
                  </NavLink>
                </li>

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/login"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/register"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

           
            {isLoggedIn && (
              <>
          <li className="nav-item">
        <span className="nav-role">Role: {userRole}</span>
          </li>
          </>
            )}
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
