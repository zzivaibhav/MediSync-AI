import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/signup'
import EmailConfirmation from './pages/emailConfirmation'
import Login from './pages/login'
import Dashboard from './components/layout/Dashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import Patients from './pages/dashboard/Patients'

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return token !== null && token !== undefined;
  };

  // Force a re-render when localStorage changes
  const [, setForceUpdate] = React.useState(0);
  
  React.useEffect(() => {
    const handleStorageChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check auth status immediately when component mounts
    setForceUpdate(prev => prev + 1);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard><DashboardHome /></Dashboard> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard/patients" 
          element={isAuthenticated() ? <Dashboard><Patients /></Dashboard> : <Navigate to="/login" />} 
        />
        
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App