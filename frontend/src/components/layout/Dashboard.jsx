import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { 
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Drawer
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Settings,
  ExitToApp
} from '@mui/icons-material';

const Dashboard = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email || 'User');
  }, []);

  const handleDrawerToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240, 
            backgroundColor: '#1f2937',
            color: 'white' 
          },
        }}
      >
        <Sidebar onClose={handleDrawerToggle} />
      </Drawer>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 border-r border-gray-800">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg">
          <div className="h-16 px-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { lg: 'none' } }}
              >
                <MenuIcon className="text-gray-400" />
              </IconButton>
              <h1 className="text-xl font-semibold text-white">
                {location.pathname === '/dashboard' ? 'Dashboard' :
                 location.pathname === '/dashboard/patients' ? 'Patients' :
                 location.pathname === '/dashboard/appointments' ? 'Appointments' :
                 location.pathname === '/dashboard/analysis' ? 'Analysis' :
                 location.pathname === '/dashboard/settings' ? 'Settings' : 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              

              <div>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#4f46e5' }}>
                    {userEmail.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#1f2937',
                      color: 'white',
                      borderRadius: '0.375rem',
                      border: '1px solid #374151',
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleClose(); navigate('/dashboard/profile'); }}>
                    <AccountCircle className="mr-2" /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate('/dashboard/settings'); }}>
                    <Settings className="mr-2" /> Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp className="mr-2" /> Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
