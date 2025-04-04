import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: location.state?.message ? true : false,
    message: location.state?.message || '',
    severity: location.state?.message ? 'success' : 'error'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

      const response = await axios.post(`${serverURL}/cognito/login`, 
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );

      console.log('Server response:', response);

      // Access the nested AuthenticationResult
      const authResult = response.data.data.AuthenticationResult;
      
      // Store tokens/session info from the correct nested path
      localStorage.setItem('accessToken', authResult.AccessToken);
      localStorage.setItem('refreshToken', authResult.RefreshToken);
      localStorage.setItem('idToken', authResult.IdToken);
      localStorage.setItem('userEmail', formData.email);

      // Show success message
      setSnackbar({
        open: true,
        message: 'Login successful! Redirecting...',
        severity: 'success',
      });

      // Redirect immediately after setting tokens
      navigate('/dashboard');

    } catch (err) {
      console.error('Error details:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Invalid email or password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Welcome back to MediSync-AI
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-700 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email address"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-700 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Sign up
            </button>
          </p>
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
