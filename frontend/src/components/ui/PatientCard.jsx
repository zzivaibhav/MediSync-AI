import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, IconButton, Chip, Collapse, Tooltip, LinearProgress } from '@mui/material';
import { 
  Edit, 
  VisibilityOutlined, 
  DeleteOutlined,
  CloudUpload,
  AddCircleOutline,
  MedicalServices,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle,
  InsertDriveFile
} from '@mui/icons-material';
import { HexagonalAvatar } from './HexagonalAvatar';

export const PatientCard = ({ 
  patient, 
  isExpanded,
  onExpand,
  onEdit,
  onDelete,
  onUpload,
  onAddVisit,
  onDeleteVisit,
  onVisitDeleted,
  onRefresh, // Add this prop
  visits = []
}) => {
  // Calculate age from DOB
  const age = Math.floor((new Date() - new Date(patient.DOB)) / (365.25 * 24 * 60 * 60 * 1000));

  // Get status styles
  const getStatusStyle = (status) => {
    const styles = {
      'Active': { color: '#10b981', bg: '#10b98110' },
      'Pending': { color: '#f59e0b', bg: '#f59e0b10' },
      'Inactive': { color: '#ef4444', bg: '#ef444410' }
    };
    return styles[status] || styles['Active'];
  };

  const statusStyle = getStatusStyle(patient.status);

  // Simplified status config
  const getStatusConfig = (status) => {
    return status === 'Processed' ? {
      color: '#10b981',
      icon: <CheckCircle fontSize="small" />,
      label: 'Report Ready',
      bg: 'rgba(16, 185, 129, 0.1)'
    } : {
      color: '#f59e0b',
      icon: <CloudUpload fontSize="small" />,
      label: 'Processing',
      bg: 'rgba(245, 158, 11, 0.1)'
    };
  };

  const handleDeleteVisit = async (visit) => {
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
          params: { id: visit.id }
        }
      );

      if (response.data && response.data.success) {
        // Notify parent component that visit was deleted
        onVisitDeleted?.(visit.id);
      } else {
        throw new Error(response.data?.message || 'Failed to delete visit');
      }
    } catch (error) {
      console.error('Error deleting visit:', error);
      // You might want to handle error notification through a global notification system
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.(patient.id);
    setTimeout(() => setIsRefreshing(false), 1000); // Keep spinning for at least 1s
  };

  return (
    <Box
      sx={{
        bgcolor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '12px',
        p: 2.5,
        mb: 2,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(30, 41, 59, 0.7)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Patient Info */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <HexagonalAvatar 
            name={patient.name} 
            size={50} 
            colors={['#0ea5e9', '#3b82f6']} 
          />
          <Box>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600, mb: 0.5 }}>
              {patient.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {patient.email}
              </Typography>
              <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', bgcolor: '#475569' }} />
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {patient.phoneNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={patient.status || 'Active'}
                size="small"
                sx={{
                  color: statusStyle.color,
                  bgcolor: statusStyle.bg,
                  borderRadius: '6px',
                  height: '24px'
                }}
              />
              <Chip 
                label={`${age} years`}
                size="small"
                sx={{
                  color: '#94a3b8',
                  bgcolor: 'rgba(148, 163, 184, 0.1)',
                  borderRadius: '6px',
                  height: '24px'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Primary Actions Group */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 0.5,
              bgcolor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <Tooltip title="View Details">
              <IconButton
                size="small"
                sx={{
                  color: '#38bdf8',
                  '&:hover': {
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Patient">
              <IconButton
                size="small"
                onClick={onEdit}
                sx={{
                  color: '#22c55e',
                  '&:hover': {
                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Secondary Actions Group */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 0.5,
              ml: 1,
              bgcolor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <Tooltip title="Add Visit">
              <IconButton
                size="small"
                onClick={onAddVisit}
                sx={{
                  color: '#8b5cf6',
                  '&:hover': {
                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <AddCircleOutline fontSize="small" />
              </IconButton>
            </Tooltip>

            
          </Box>

          {/* Utility Actions Group */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 0.5,
              ml: 1,
              bgcolor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <Tooltip title="Delete Patient">
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh Visits">
              <IconButton
                size="small"
                onClick={handleRefresh}
                sx={{
                  color: '#64748b',
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(100, 116, 139, 0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
              <IconButton
                size="small"
                onClick={onExpand}
                sx={{
                  color: '#64748b',
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(100, 116, 139, 0.1)',
                    transform: `${isExpanded ? 'rotate(180deg)' : 'none'} translateY(-1px)`
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <KeyboardArrowDown fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Visits Section */}
      <Collapse in={isExpanded} timeout={200}>
        <Box sx={{ mt: 3, pl: 7 }}>
          {visits.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
              No visits recorded yet
            </Typography>
          ) : (
            visits.map((visit, index) => {
              const statusConfig = getStatusConfig(visit.status);
              
              return (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    pb: 3,
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      left: '-20px',
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      bgcolor: '#0ea5e9',
                      opacity: 0.3
                    }
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        '& .delete-button': {
                          opacity: 1,
                          transform: 'translateX(0)'
                        }
                      }
                    }}
                  >
                    {/* Visit Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MedicalServices sx={{ fontSize: 16, color: '#0ea5e9' }} />
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {new Date(visit.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {/* Delete Button */}
                      <Tooltip title="Delete Visit">
                        <IconButton
                          size="small"
                          className="delete-button"
                          onClick={() => handleDeleteVisit(visit)}
                          sx={{
                            color: '#ef4444',
                            opacity: 0,
                            transform: 'translateX(10px)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(239, 68, 68, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Visit Content */}
                    <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 2 }}>
                      {visit.purpose}
                    </Typography>

                    {/* Analysis Status */}
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: visit.status === 'Processing' 
                          ? 'rgba(245, 158, 11, 0.05)' 
                          : 'rgba(16, 185, 129, 0.05)',
                        borderRadius: '8px',
                        border: visit.status === 'Processing'
                          ? '1px solid #f59e0b20'
                          : '1px solid #10b98120',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {visit.status === 'Processing' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <CloudUpload 
                                sx={{ 
                                  color: '#f59e0b',
                                  animation: 'pulse 2s infinite'
                                }} 
                              />
                            </Box>
                            <Typography sx={{ color: '#f59e0b', fontWeight: 500 }}>
                              Analysis in Progress
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress 
                              sx={{
                                bgcolor: 'rgba(245, 158, 11, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#f59e0b'
                                },
                                height: 6,
                                borderRadius: 3
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#94a3b8',
                                display: 'block',
                                mt: 1,
                                textAlign: 'center'
                              }}
                            >
                              This may take a few minutes
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckCircle sx={{ color: '#10b981' }} />
                            <Typography sx={{ color: '#10b981', fontWeight: 500 }}>
                              Report Ready
                            </Typography>
                            <Tooltip title="View Report">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#10b981',
                                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                                  '&:hover': {
                                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                                  }
                                }}
                              >
                                <InsertDriveFile fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Collapse>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};
