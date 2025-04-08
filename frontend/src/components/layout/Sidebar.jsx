import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  LocalHospital as LocalHospitalIcon,
  Help as HelpIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { Avatar, Box, Divider, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const Sidebar = ({ onClose = () => {} }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Patients', icon: <PeopleIcon />, path: '/dashboard/patients' },
    
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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Logo and Brand */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="mr-2"
          >
            <div className="bg-blue-500 p-2 rounded-lg">
              <LocalHospitalIcon sx={{ color: 'white', fontSize: 28 }} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              MS <span className="text-blue-300">AI</span>
            </h1>
          </motion.div>
        </div>
      </div>

      

      <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation Menu */}
      <nav className="mt-2 flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.path);
            
            return (
              <motion.li 
                key={item.name} 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
              >
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-900/30'
                        : 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-100'
                    }`
                  }
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${isActive ? 'text-blue-200' : ''}`}>{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <KeyboardArrowRightIcon fontSize="small" />
                    </motion.div>
                  )}
                </NavLink>
              </motion.li>
            )}
          )}
        </ul>
      </nav>

      {/* Help Section */}
      <div className="p-4 mt-auto">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 shadow-lg border border-gray-700"
        >
          <div className="flex items-start">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <HelpIcon sx={{ color: 'white', fontSize: 18 }} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-200">Need assistance?</h3>
              <p className="text-xs text-gray-400 mt-1 mb-3">
                Get help with your account or technical support.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-1 transition-all shadow-md shadow-blue-900/20"
              >
                <span>Support Center</span>
                <KeyboardArrowRightIcon fontSize="small" />
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-4 text-xs text-center text-gray-500">
          <p>MediSync AI v1.0.2</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
