import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  IconButton,
  Alert,
  InputAdornment
} from '@mui/material';
import { ArrowBack, CalendarToday, Phone, Email, Person } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    DOB: null,
    phoneNumber: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    DOB: '',
    phoneNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      DOB: date
    });

    if (formErrors.DOB) {
      setFormErrors({
        ...formErrors,
        DOB: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', DOB: '', phoneNumber: '' };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.DOB) {
      newErrors.DOB = 'Date of birth is required';
      valid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!/^\+?[1-9]\d{9,14}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Phone number is invalid';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Create a regular JSON object instead of FormData
    const payload = {
      name: formData.name,
      email: formData.email,
      DOB: formData.DOB.toISOString(),
      phoneNumber: formData.phoneNumber
    };

    // Add more detailed debug logs
    console.log('Sending data:', payload);
    
    try {
      const token = localStorage.getItem('accessToken');
      const serverUrl = import.meta.env.VITE_SERVER || 'http://localhost:8080';
      
      // Use JSON content type instead of multipart/form-data
      const response = await axios.post(`${serverUrl}/doctor-api/create-patient`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Server response:', response.data);
      
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/dashboard/patients');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={() => navigate('/dashboard/patients')} 
            sx={{ color: 'white', mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Add New Patient
          </Typography>
        </Box>
      </div>

      <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)' }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'rgb(16, 185, 129)' }}>
              Patient created successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Patient Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#374151',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#4b5563',
                        },
                        '&:hover fieldset': {
                          borderColor: '#60a5fa',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#9ca3af',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#374151',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#4b5563',
                        },
                        '&:hover fieldset': {
                          borderColor: '#60a5fa',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#9ca3af',
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.DOB}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!formErrors.DOB,
                          helperText: formErrors.DOB,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday sx={{ color: '#9ca3af' }} />
                              </InputAdornment>
                            ),
                          },
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              bgcolor: '#374151',
                              borderRadius: 2,
                              '& fieldset': {
                                borderColor: '#4b5563',
                              },
                              '&:hover fieldset': {
                                borderColor: '#60a5fa',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#9ca3af',
                            },
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={!!formErrors.phoneNumber}
                    helperText={formErrors.phoneNumber}
                    required
                    placeholder="+1 (555) 123-4567"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#374151',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#4b5563',
                        },
                        '&:hover fieldset': {
                          borderColor: '#60a5fa',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#9ca3af',
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/patients')}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: '#4b5563',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#60a5fa',
                      bgcolor: 'rgba(96, 165, 250, 0.04)',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || success}
                  sx={{ borderRadius: 2 }}
                >
                  {loading ? 'Creating...' : 'Create Patient'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPatient;
