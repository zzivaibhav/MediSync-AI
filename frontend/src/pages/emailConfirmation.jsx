import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Get email from location state (passed from signup page)
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If email not in state, try local storage or redirect back to signup
      const storedEmail = localStorage.getItem('pendingVerificationEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        navigate('/signup');
        setSnackbar({
          open: true,
          message: 'Email verification required',
          severity: 'error'
        });
      }
    }
  }, [location, navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setSnackbar({
        open: true,
        message: 'Verification code is required',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      const serverURL = import.meta.env.VITE_SERVER_URL;
      
      const response = await axios.post(`${serverURL}/cognito/confirm`, {
        email,
        code: verificationCode
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      console.log('Server response:', response);

      // Show success message
      setSnackbar({
        open: true,
        message: 'Email verified successfully! Redirecting to login...',
        severity: 'success'
      });

      // Clear the stored email
      localStorage.removeItem('pendingVerificationEmail');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified successfully. You can now log in.' }
        });
      }, 2000);
    } catch (err) {
      console.error('Error details:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Verification failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      setLoading(true);
      const serverURL = import.meta.env.VITE_SERVER_URL;
      
      await axios.post(`${serverURL}/cognito/resend-verification`, { 
        email 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      setSnackbar({
        open: true,
        message: 'Verification code has been resent to your email',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to resend verification code',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We've sent a verification code to{' '}
            <span className="font-medium text-blue-400">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="verificationCode" className="sr-only">
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-700 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={resendVerificationCode}
            disabled={loading}
            className="text-sm text-blue-500 hover:text-blue-400 disabled:text-gray-500"
          >
            Resend verification code
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            Back to signup
          </button>
        </div>
      </div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
