import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { getSidebarData } from './SidebarData';

import './Sidebar.css';

function Sidebar({ role }) {
  const [sidebar, setSidebar] = useState(false);
  const sidebarData = getSidebarData(role);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='sidebar'>
          <Link to='#' className='side-menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav
          className={sidebar ? 'side-nav-menu active' : 'side-nav-menu'}
          style={{ zIndex: sidebar ? '1' : 'unset' }} // Add this style
        >
          <ul className='side-nav-menu-items' onClick={showSidebar}>
            <li className='side-navbar-toggle'>
              <Link to='#' className='side-menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {sidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
