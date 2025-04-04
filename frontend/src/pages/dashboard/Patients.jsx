import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Pagination,
  Menu,
  MenuItem,
  Alert,
  Avatar,
  Tooltip,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  FilterList,
  Sort,
  Edit,
  VisibilityOutlined,
  DeleteOutlined,
  CheckCircle,
  ErrorOutline,
  CloudUpload
} from '@mui/icons-material';
import axios from 'axios';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import EditPatientModal from '../../components/modals/EditPatientModal';

const Patients = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name (A-Z)');
  const [error, setError] = useState(null);
  
  // New states for edit functionality
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // New states for delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // New states for audio upload functionality
  const [audioUploadDialogOpen, setAudioUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingPatient, setUploadingPatient] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch patients data
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/get-patients`, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        setPatients(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch patients');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to fetch patients. Please try again later.');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle opening edit modal
  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedPatient(null);
  };

  // Handle patient update success
  const handlePatientUpdated = (updatedPatient) => {
    // Update the patient in the local state
    setPatients(patients.map(patient => 
      patient.id === updatedPatient.id ? updatedPatient : patient
    ));
    
    // Show success notification
    setNotification({
      open: true,
      message: 'Patient information updated successfully',
      severity: 'success'
    });
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle opening delete dialog
  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  // Handle closing delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  // Handle patient deletion
  const handleDeletePatient = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/delete-patient`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          data: { id: patientToDelete.id }
        }
      );
      
      if (response.data && response.data.success) {
        // Remove patient from local state
        setPatients(patients.filter(patient => patient.id !== patientToDelete.id));
        
        // Show success notification
        setNotification({
          open: true,
          message: 'Patient deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.data?.message || 'Failed to delete patient');
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      setNotification({
        open: true,
        message: err.message || 'Failed to delete patient. Please try again later.',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Handle opening audio upload dialog
  const handleAudioUploadClick = (patient) => {
    setUploadingPatient(patient);
    setAudioUploadDialogOpen(true);
  };

  // Handle audio file selection
  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
    } else {
      setNotification({
        open: true,
        message: 'Please select a valid audio file',
        severity: 'error'
      });
    }
  };

  // Handle audio upload
  const handleAudioUpload = async () => {
    if (!selectedFile || !uploadingPatient) return;

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('patientId', uploadingPatient.id);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/upload-conversation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      setNotification({
        open: true,
        message: 'Audio uploaded successfully',
        severity: 'success'
      });
      setAudioUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Failed to upload audio',
        severity: 'error'
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (filter) => {
    if (filter && filter !== selectedFilter) {
      setSelectedFilter(filter);
    }
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (sort) => {
    if (sort && sort !== sortBy) {
      setSortBy(sort);
    }
    setSortAnchorEl(null);
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber.includes(searchTerm)
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch(sortBy) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Last Visit (Recent)':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'Last Visit (Oldest)':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const paginatedPatients = sortedPatients.slice((page - 1) * 10, page * 10);

  const filterOptions = ['All', 'Active', 'Pending', 'Inactive'];
  const sortOptions = ['Name (A-Z)', 'Name (Z-A)', 'Last Visit (Recent)', 'Last Visit (Oldest)'];

  // Function to get avatar text from name
  const getAvatarText = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Function to get random status for demo purposes
  const getRandomStatus = () => {
    const statuses = ['Active', 'Pending', 'Inactive'];
    return statuses[Math.floor(Math.random() % 3)];
  };

  // Function to get status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { bg: '#065f46', color: '#a7f3d0' };
      case 'Pending': return { bg: '#854d0e', color: '#fef08a' };
      case 'Inactive': return { bg: '#7f1d1d', color: '#fecaca' };
      default: return { bg: '#1f2937', color: '#e5e7eb' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
          Patient Management
        </Typography>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/dashboard/add-patient')}
        >
          Add New Patient
        </Button>
      </div>

      <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <TextField
              placeholder="Search patients..."
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: { lg: '400px' },
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
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />

            <div className="flex items-center gap-2">
              <Box display="flex" alignItems="center" sx={{ color: '#9ca3af', mr: 1 }}>
                <Typography variant="body2">
                  {filteredPatients.length} patients
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleFilterClick}
                sx={{ 
                  borderRadius: 2,
                  borderColor: '#4b5563',
                  color: selectedFilter !== 'All' ? 'primary.main' : 'white',
                  '&:hover': {
                    borderColor: '#60a5fa',
                    bgcolor: 'rgba(96, 165, 250, 0.04)',
                  }
                }}
              >
                {selectedFilter}
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => handleFilterClose()}
                PaperProps={{
                  sx: {
                    bgcolor: '#1f2937',
                    color: 'white',
                    border: '1px solid #374151',
                    borderRadius: 2,
                  }
                }}
              >
                {filterOptions.map((option) => (
                  <MenuItem 
                    key={option} 
                    onClick={() => handleFilterClose(option)}
                    selected={selectedFilter === option}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'rgba(96, 165, 250, 0.15)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(96, 165, 250, 0.08)',
                      }
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>

              <Button
                variant="outlined"
                startIcon={<Sort />}
                onClick={handleSortClick}
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
                Sort
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => handleSortClose()}
                PaperProps={{
                  sx: {
                    bgcolor: '#1f2937',
                    color: 'white',
                    border: '1px solid #374151',
                    borderRadius: 2,
                  }
                }}
              >
                {sortOptions.map((option) => (
                  <MenuItem 
                    key={option} 
                    onClick={() => handleSortClose(option)}
                    selected={sortBy === option}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'rgba(96, 165, 250, 0.15)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(96, 165, 250, 0.08)',
                      }
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={10} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedPatients.map((patient) => {
                    // Generate status for demo (replace with actual status from API when available)
                    const status = patient.status || getRandomStatus();
                    const statusStyle = getStatusColor(status);
                    
                    return (
                      <tr key={patient.id} className="hover:bg-gray-800 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar 
                              sx={{ 
                                bgcolor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 40%)`,
                                width: 40, 
                                height: 40,
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {getAvatarText(patient.name)}
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{patient.name}</div>
                              <div className="text-xs text-gray-400">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 flex flex-col">
                            <div className="flex items-center">
                              <span className="material-icons text-xs mr-1" style={{ fontSize: '16px' }}>📧</span>
                              {patient.email}
                            </div>
                            <div className="flex items-center text-gray-400">
                              <span className="material-icons text-xs mr-1" style={{ fontSize: '16px' }}>📱</span>
                              {patient.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{new Date(patient.DOB).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {Math.floor((new Date() - new Date(patient.DOB)) / (365.25 * 24 * 60 * 60 * 1000))} years old
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Chip 
                            label={status}
                            size="small"
                            sx={{ 
                              bgcolor: statusStyle.bg, 
                              color: statusStyle.color,
                              fontWeight: 'medium',
                              '& .MuiChip-label': {
                                px: 2
                              }
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{new Date(patient.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">{new Date(patient.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-1">
                            <Tooltip title="View Patient">
                              <IconButton size="small" sx={{ color: '#60a5fa', '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' } }}>
                                <VisibilityOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Patient">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#22c55e', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.1)' } }}
                                onClick={() => handleEditClick(patient)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Upload Audio">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#f59e0b', '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' } }}
                                onClick={() => handleAudioUploadClick(patient)}
                              >
                                <CloudUpload fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Patient">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                onClick={() => handleDeleteClick(patient)}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (
            <Box display="flex" justifyContent="center" pt={3}>
              <Pagination 
                count={Math.ceil(filteredPatients.length / 10)} 
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Patient Modal */}
      {selectedPatient && (
        <EditPatientModal
          open={editModalOpen}
          handleClose={handleCloseEditModal}
          patient={selectedPatient}
          onPatientUpdated={handlePatientUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            bgcolor: '#1f2937',
            color: 'white',
            border: '1px solid #374151',
            borderRadius: 2,
            maxWidth: '500px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorOutline color="error" /> Delete Patient
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#d1d5db' }}>
            Are you sure you want to delete patient <strong>{patientToDelete?.name}</strong>?
            This action cannot be undone and all patient data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            sx={{ 
              color: '#d1d5db',
              '&:hover': { bgcolor: 'rgba(209, 213, 219, 0.08)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePatient} 
            variant="contained"
            color="error"
            sx={{ borderRadius: 1 }}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Audio Upload Dialog */}
      <Dialog
        open={audioUploadDialogOpen}
        onClose={() => setAudioUploadDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1f2937',
            color: 'white',
            border: '1px solid #374151',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle>Upload Audio Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#d1d5db', mb: 2 }}>
            Upload audio conversation for patient: {uploadingPatient?.name}
          </DialogContentText>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Choose Audio File
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={handleAudioFileChange}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ color: '#d1d5db' }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          {uploadProgress > 0 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAudioUploadDialogOpen(false)}
            sx={{ color: '#d1d5db' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAudioUpload}
            variant="contained"
            disabled={!selectedFile}
            startIcon={<CloudUpload />}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            bgcolor: notification.severity === 'success' ? '#065f46' : '#7f1d1d',
            color: notification.severity === 'success' ? '#a7f3d0' : '#fecaca'
          }}
          icon={notification.severity === 'success' ? <CheckCircle /> : undefined}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Patients;
