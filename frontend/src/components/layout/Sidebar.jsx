import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const Sidebar = ({ onClose = () => {} }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Patients', icon: <PeopleIcon />, path: '/dashboard/patients' },
    { name: 'Appointments', icon: <EventNoteIcon />, path: '/dashboard/appointments' },
    { name: 'Analysis', icon: <AssessmentIcon />, path: '/dashboard/analysis' },
    { name: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  // Check if path is active - helper function
  const checkIsActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-center items-center">
          <h1 className="text-xl font-bold text-blue-300">Medi-sync</h1>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="px-2 py-1">
              <NavLink
                to={item.path}
                onClick={onClose}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-400 hover:text-gray-100'
                  }`
                }
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300">Need help?</h3>
          <p className="text-xs text-gray-400 mt-1">
            Contact support or check our documentation for assistance.
          </p>
          <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
