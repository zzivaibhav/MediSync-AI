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
  LinearProgress,
  TextareaAutosize,
  Collapse,
  Paper
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
  CloudUpload,
  AddCircleOutline,
  ExpandMore,
  ExpandLess,
  MedicalServices,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import EditPatientModal from '../../components/modals/EditPatientModal';
import { motion } from 'framer-motion';
import { HexagonalAvatar } from '../../components/ui/HexagonalAvatar';
import { PatientCard } from '../../components/ui/PatientCard';

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

  // New states for visit creation
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [visitingPatient, setVisitingPatient] = useState(null);
  const [visitPurpose, setVisitPurpose] = useState('');

  // New states for visits
  const [patientVisits, setPatientVisits] = useState({});
  const [expandedPatient, setExpandedPatient] = useState(null);
  
  const [visitToDelete, setVisitToDelete] = useState(null);
  const [deleteVisitDialogOpen, setDeleteVisitDialogOpen] = useState(false);

  const theme = {
    colors: {
      primary: {
        main: '#0891b2',
        light: '#22d3ee',
        dark: '#0e7490',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)'
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
      },
      background: {
        main: '#0f172a',
        paper: 'rgba(30, 41, 59, 0.7)',
        card: 'rgba(15, 23, 42, 0.6)',
        gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      },
      status: {
        active: '#10b981',
        pending: '#f59e0b',
        inactive: '#ef4444'
      }
    },
    glassmorphism: {
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
    }
  };

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
        const fetchedPatients = response.data.data || [];
        setPatients(fetchedPatients);
        // Fetch visits for each patient
        fetchedPatients.forEach(patient => fetchVisits(patient.id));
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

  // Fetch visits for a patient
  const fetchVisits = async (patientId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/get-visits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: { id:patientId }
        }
      );

      if (response.data && response.data.success) {
        setPatientVisits(prev => ({
          ...prev,
          [patientId]: response.data.data || []
        }));
      }
    } catch (err) {
      console.error('Error fetching visits:', err);
    }
  };

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
    formData.append('file', selectedFile);
    formData.append('patientId', uploadingPatient.id);
    formData.append("name", uploadingPatient.name);
    formData.append("email", uploadingPatient.email);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

    const response =   await axios.post(
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

  // Handle opening visit dialog
  const handleVisitClick = (patient) => {
    setVisitingPatient(patient);
    setVisitDialogOpen(true);
  };

  // Handle visit creation
  const handleCreateVisit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/create-visit`,
        {
          id: visitingPatient.id,
          email: visitingPatient.email,
          purpose: visitPurpose
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        setNotification({
          open: true,
          message: 'Visit created successfully',
          severity: 'success'
        });
        setVisitDialogOpen(false);
        setVisitPurpose('');
        setVisitingPatient(null);
      } else {
        throw new Error(response.data?.message || 'Failed to create visit');
      }
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Failed to create visit. Please try again later.',
        severity: 'error'
      });
    }
  };

  // Handle visit deletion
  const handleDeleteVisit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/delete-visit`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          params: { id: visitToDelete.id }
        }
      );

      if (response.data && response.data.success) {
        // Update local state to remove the deleted visit
        setPatientVisits(prev => ({
          ...prev,
          [visitToDelete.patientId]: prev[visitToDelete.patientId].filter(
            visit => visit.id !== visitToDelete.id
          )
        }));

        setNotification({
          open: true,
          message: 'Visit deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.data?.message || 'Failed to delete visit');
      }
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Failed to delete visit. Please try again later.',
        severity: 'error'
      });
    } finally {
      setDeleteVisitDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  const handleVisitDeleted = (patientId, visitId) => {
    setPatientVisits(prev => ({
      ...prev,
      [patientId]: prev[patientId].filter(visit => visit.id !== visitId)
    }));
  };

  const handleRefreshVisits = async (patientId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/get-visits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: { id: patientId }
        }
      );

      if (response.data && response.data.success) {
        setPatientVisits(prev => ({
          ...prev,
          [patientId]: response.data.data || []
        }));
      }
    } catch (err) {
      console.error('Error refreshing visits:', err);
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
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MedicalServices 
              sx={{ 
                fontSize: 40, 
                color: theme.colors.secondary.main,
                animation: 'pulse 2s infinite ease-in-out'
              }} 
            />
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}
              >
                Patient Management
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'grey.400',
                  mt: 0.5 
                }}
              >
                Manage your patients and their medical records
              </Typography>
            </Box>
          </Box>

          <Button 
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/dashboard/add-patient')}
            sx={{
              bgcolor: theme.colors.primary.main,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: theme.colors.secondary.main,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
              }
            }}
          >
            Add New Patient
          </Button>
        </Box>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card 
          sx={{ 
            bgcolor: theme.colors.background.card,
            borderRadius: 3,
            border: `1px solid ${theme.colors.secondary.main}20`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent>
            {/* Search and Filters Section */}
            <Box 
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { lg: 'center' },
                justifyContent: 'space-between',
                gap: 3,
                mb: 4,
              }}
            >
              {/* Search Field */}
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
                    bgcolor: `${theme.colors.background.paper}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: `${theme.colors.secondary.main}40`,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.colors.secondary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.colors.primary.main,
                      borderWidth: 2
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Filter Buttons */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}
              >
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
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Patients List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Box sx={{ mt: 4 }}>
            {paginatedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isExpanded={expandedPatient === patient.id}
                onExpand={() => setExpandedPatient(expandedPatient === patient.id ? null : patient.id)}
                onEdit={() => handleEditClick(patient)}
                onDelete={() => handleDeleteClick(patient)}
                onUpload={() => handleAudioUploadClick(patient)}
                onAddVisit={() => handleVisitClick(patient)}
                visits={patientVisits[patient.id] || []}
                onVisitDeleted={(visitId) => handleVisitDeleted(patient.id, visitId)}
                onRefresh={handleRefreshVisits}
              />
            ))}
          </Box>
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && (
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 4,
          }}
        >
          <Pagination 
            count={Math.ceil(filteredPatients.length / 10)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'grey.400',
                '&.Mui-selected': {
                  bgcolor: `${theme.colors.primary.main}40`,
                  color: 'white',
                  '&:hover': {
                    bgcolor: `${theme.colors.primary.main}60`,
                  }
                }
              }
            }}
          />
        </Box>
      )}

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
      
      {/* Add Visit Dialog */}
      <Dialog
        open={visitDialogOpen}
        onClose={() => setVisitDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1f2937',
            color: 'white',
            border: '1px solid #374151',
            borderRadius: 2,
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle>Create New Visit</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#d1d5db', mb: 2 }}>
            Creating visit for patient: {visitingPatient?.name}
          </DialogContentText>
          <TextareaAutosize
            minRows={4}
            placeholder="Enter the purpose of visit..."
            value={visitPurpose}
            onChange={(e) => setVisitPurpose(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#374151',
              color: 'white',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              resize: 'vertical',
              fontSize: '14px'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setVisitDialogOpen(false);
              setVisitPurpose('');
              setVisitingPatient(null);
            }}
            sx={{ color: '#d1d5db' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateVisit}
            variant="contained"
            disabled={!visitPurpose.trim()}
            startIcon={<AddCircleOutline />}
          >
            Create Visit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Delete Visit Dialog */}
      <Dialog
        open={deleteVisitDialogOpen}
        onClose={() => {
          setDeleteVisitDialogOpen(false);
          setVisitToDelete(null);
        }}
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
          <ErrorOutline color="error" /> Delete Visit
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#d1d5db' }}>
            Are you sure you want to delete this visit record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => {
              setDeleteVisitDialogOpen(false);
              setVisitToDelete(null);
            }}
            sx={{ 
              color: '#d1d5db',
              '&:hover': { bgcolor: 'rgba(209, 213, 219, 0.08)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteVisit} 
            variant="contained"
            color="error"
            sx={{ borderRadius: 1 }}
            startIcon={<DeleteOutlined />}
          >
            Delete
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
    </Box>
  );
};

export default Patients;
