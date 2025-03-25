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
  MenuItem
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  FilterList,
  Sort
} from '@mui/icons-material';
import { TableSkeleton } from '../../components/ui/Skeleton';

const Patients = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name (A-Z)');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Mock patient data
      const mockPatients = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Patient ${i + 1}`,
        email: `patient${i + 1}@example.com`,
        phone: `+1 (555) ${100 + i}-${1000 + i}`,
        lastVisit: new Date(2023, 4, 15 - i).toLocaleDateString(),
        status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive'
      }));
      setPatients(mockPatients);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
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
    (selectedFilter === 'All' || patient.status === selectedFilter) &&
    (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch(sortBy) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Last Visit (Recent)':
        return new Date(b.lastVisit) - new Date(a.lastVisit);
      case 'Last Visit (Oldest)':
        return new Date(a.lastVisit) - new Date(b.lastVisit);
      default:
        return 0;
    }
  });

  const paginatedPatients = sortedPatients.slice((page - 1) * 10, page * 10);

  const filterOptions = ['All', 'Active', 'Pending', 'Inactive'];
  const sortOptions = ['Name (A-Z)', 'Name (Z-A)', 'Last Visit (Recent)', 'Last Visit (Oldest)'];

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
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div>{patient.email}</div>
                        <div className="text-gray-400">{patient.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {patient.lastVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Chip 
                          label={patient.status} 
                          size="small"
                          sx={{
                            bgcolor: 
                              patient.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' :
                              patient.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' :
                              'rgba(239, 68, 68, 0.2)',
                            color: 
                              patient.status === 'Active' ? 'rgb(16, 185, 129)' :
                              patient.status === 'Pending' ? 'rgb(245, 158, 11)' :
                              'rgb(239, 68, 68)',
                            borderRadius: '4px',
                            '& .MuiChip-label': {
                              px: 1,
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <MoreVert />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
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
