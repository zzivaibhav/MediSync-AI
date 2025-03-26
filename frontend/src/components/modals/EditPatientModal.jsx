import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import { Close as CloseIcon, Email, Phone, CalendarMonth, Person } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name should be at least 2 characters'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  DOB: yup
    .date()
    .required('Date of Birth is required')
    .max(new Date(), 'Date of Birth cannot be in the future'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number')
});

const EditPatientModal = ({ open, handleClose, patient, onPatientUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const formik = useFormik({
    initialValues: {
      name: patient?.name || '',
      email: patient?.email || '',
      DOB: patient?.DOB ? new Date(patient.DOB) : null,
      phoneNumber: patient?.phoneNumber || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);
      
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await axios.put(
          `${import.meta.env.VITE_SERVER}/doctor-api/update-patient`,
          {
            id: patient.id,
            ...values,
            DOB: values.DOB ? values.DOB.toISOString() : null
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (response.data && response.data.success) {
          onPatientUpdated(response.data.data);
          handleClose();
        } else {
          throw new Error(response.data?.message || 'Failed to update patient');
        }
      } catch (error) {
        console.error('Error updating patient:', error);
        setApiError(error.response?.data?.message || error.message || 'Failed to update patient');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: '#1f2937',
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Edit Patient Information
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleClose} 
          disabled={loading} 
          aria-label="close"
          sx={{ color: '#9ca3af' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers sx={{ borderColor: '#374151' }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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
                    '& fieldset': { borderColor: '#4b5563' },
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                  },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .Mui-focused .MuiInputLabel-root': { color: '#60a5fa' },
                  '& .Mui-error .MuiInputLabel-root': { color: '#ef4444' },
                  '& .MuiFormHelperText-root': { color: '#ef4444' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                    '& fieldset': { borderColor: '#4b5563' },
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                  },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .Mui-focused .MuiInputLabel-root': { color: '#60a5fa' },
                  '& .Mui-error .MuiInputLabel-root': { color: '#ef4444' },
                  '& .MuiFormHelperText-root': { color: '#ef4444' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formik.values.DOB}
                  onChange={(newValue) => {
                    formik.setFieldValue('DOB', newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      id: "DOB",
                      name: "DOB",
                      error: formik.touched.DOB && Boolean(formik.errors.DOB),
                      helperText: formik.touched.DOB && formik.errors.DOB,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonth sx={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        ),
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#374151',
                          borderRadius: 2,
                          '& fieldset': { borderColor: '#4b5563' },
                          '&:hover fieldset': { borderColor: '#60a5fa' },
                        },
                        '& .MuiOutlinedInput-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: '#9ca3af' },
                        '& .Mui-focused .MuiInputLabel-root': { color: '#60a5fa' },
                        '& .Mui-error .MuiInputLabel-root': { color: '#ef4444' },
                        '& .MuiFormHelperText-root': { color: '#ef4444' },
                      }
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
                    '& fieldset': { borderColor: '#4b5563' },
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                  },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .Mui-focused .MuiInputLabel-root': { color: '#60a5fa' },
                  '& .Mui-error .MuiInputLabel-root': { color: '#ef4444' },
                  '& .MuiFormHelperText-root': { color: '#ef4444' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: '#1f2937', borderTop: '1px solid #374151' }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: '#4b5563',
              '&:hover': { borderColor: '#60a5fa', bgcolor: 'rgba(96, 165, 250, 0.04)' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} color="inherit" />}
            sx={{ 
              bgcolor: '#3b82f6', 
              '&:hover': { bgcolor: '#2563eb' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPatientModal;
