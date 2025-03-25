import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // or 'error'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      setLoading(true);
      const formattedPhoneNumber = `+1${formData.phone_number.replace(/\D/g, '')}`;
      
      const serverURL = 'http://localhost:8080';

      const response = await axios.post(`${serverURL}/cognito/signup`, 
        {
          name: formData.name,
          email: formData.email,
          phone_number: formattedPhoneNumber,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );

      console.log('Server response:', response); // Debug log

      // Show success message
      setSnackbar({
        open: true,
        message: 'Account created successfully! Please verify your email.',
        severity: 'success'
      });

      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', formData.email);
      
      // Redirect to email confirmation page
      setTimeout(() => {
        navigate('/email-confirmation', { state: { email: formData.email } });
      }, 2000);

    } catch (err) {
      console.error('Error details:', err); // Debug log
      // Handle axios error
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Something went wrong',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone_number') {
      // Remove any non-digit characters
      value = value.replace(/\D/g, '');
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join MediSync-AI today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-700 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full Name"
                onChange={handleChange}
              />
            </div>
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
              <label htmlFor="phone_number" className="sr-only">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  +1
                </span>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-8 bg-gray-700 border border-gray-600 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Sign in
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
