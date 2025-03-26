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
  Tooltip
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  FilterList,
  Sort,
  Edit,
  VisibilityOutlined,
  DeleteOutlined
} from '@mui/icons-material';
import axios from 'axios';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }
        
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/doctor-api/get-patients`, 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        
        if (response.data && response.data.success) {
          // Extract patients from the data array in the response
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

    fetchPatients();
  }, []);

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
                              <IconButton size="small" sx={{ color: '#22c55e', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.1)' } }}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Patient">
                              <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
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
    </div>
  );
};

export default Patients;
