import React from 'react';
import { Box, Typography, IconButton, Chip, Collapse } from '@mui/material';
import { 
  Edit, 
  VisibilityOutlined, 
  DeleteOutlined,
  CloudUpload,
  AddCircleOutline,
  MedicalServices,
  KeyboardArrowDown,
  KeyboardArrowUp
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

      {/* Visits Section */}
      <Collapse in={isExpanded} timeout={200}>
        <Box sx={{ mt: 3, pl: 7 }}>
          {visits.map((visit, index) => (
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
                  border: '1px solid rgba(148, 163, 184, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MedicalServices sx={{ fontSize: 16, color: '#0ea5e9' }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {new Date(visit.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                  {visit.purpose}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
