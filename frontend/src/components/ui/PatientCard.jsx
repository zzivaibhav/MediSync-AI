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
  Refresh as RefreshIcon 
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

  // Add this function for status styling
  const getAnalysisStatusConfig = (status) => {
    const configs = {
      completed: {
        color: '#10b981',
        progress: 100,
        label: 'Analysis Complete'
      },
      in_progress: {
        color: '#f59e0b',
        progress: 65,
        label: 'Processing...'
      },
      pending: {
        color: '#64748b',
        progress: 0,
        label: 'Pending Analysis'
      }
    };
    return configs[status] || configs.pending;
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {[
            { icon: <VisibilityOutlined />, color: '#38bdf8', title: 'View' },
            { icon: <Edit />, color: '#22c55e', title: 'Edit', onClick: onEdit },
            { icon: <AddCircleOutline />, color: '#8b5cf6', title: 'Add Visit', onClick: onAddVisit },
            { icon: <CloudUpload />, color: '#f59e0b', title: 'Upload', onClick: onUpload },
            { icon: <DeleteOutlined />, color: '#ef4444', title: 'Delete', onClick: onDelete }
          ].map((action, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={action.onClick}
              sx={{
                color: action.color,
                bgcolor: `${action.color}10`,
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  bgcolor: `${action.color}20`,
                }
              }}
            >
              {action.icon}
            </IconButton>
          ))}
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{
              color: '#64748b',
              ml: 1,
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onExpand}
            sx={{
              color: '#64748b',
              ml: 1,
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
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
              const statusConfig = getAnalysisStatusConfig(visit.analysisStatus);
              
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
                        p: 1.5,
                        bgcolor: 'rgba(15, 23, 42, 0.4)',
                        borderRadius: '6px',
                        border: `1px solid ${statusConfig.color}30`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: statusConfig.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <span className="pulse-dot" 
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: statusConfig.color,
                              display: 'inline-block',
                              animation: visit.analysisStatus === 'in_progress' ? 'pulse 1.5s infinite' : 'none'
                            }}
                          />
                          {statusConfig.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {statusConfig.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant={visit.analysisStatus === 'in_progress' ? 'indeterminate' : 'determinate'}
                        value={statusConfig.progress}
                        sx={{
                          height: 4,
                          bgcolor: 'rgba(148, 163, 184, 0.1)',
                          borderRadius: 2,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: statusConfig.color,
                            borderRadius: 2
                          }
                        }}
                      />
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
