import React from 'react';
import { Box, Typography, Grid, Paper, Chip, Fade } from '@mui/material';
import { 
  Warning, 
  LocalHospital,
  Favorite,
  DeviceThermostat,
  Speed,
  MonitorHeart
} from '@mui/icons-material';

const SectionRenderer = ({ section, data }) => {
  if (!data || data.length === 0) return null;

  const renderContent = (item) => {
    // Handle different content types
    if (Array.isArray(item)) return item.join(', ');
    if (typeof item === 'object') return item.SummarizedSegment || item.content;
    return item;
  };

  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#334155', fontWeight: 600 }}>
        {section.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
      </Typography>
      {data.map((item, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography sx={{ color: '#475569' }}>
            {renderContent(item)}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

const VitalCard = ({ title, value, isAbnormal }) => {
  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('pressure')) return <Speed />;
    if (t.includes('temp')) return <DeviceThermostat />;
    if (t.includes('heart') || t.includes('pulse')) return <MonitorHeart />;
    return <Favorite />;
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          borderRadius: 2,
          height: '100%',
          background: isAbnormal 
            ? 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)'
            : 'linear-gradient(135deg, #fff 0%, #f0fdfa 100%)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4
          }
        }}
      >
        <Box display="flex" alignItems="center" mb={1}>
          <Box sx={{ 
            mr: 1.5, 
            color: isAbnormal ? 'error.main' : 'success.main',
            display: 'flex' 
          }}>
            {getIcon(title)}
          </Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: isAbnormal 
                ? 'linear-gradient(45deg, #7f1d1d 30%, #dc2626 90%)'
                : 'linear-gradient(45deg, #064e3b 30%, #059669 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {value}
          </Typography>
          {isAbnormal && (
            <Warning sx={{ color: 'error.main', animation: 'pulse 2s infinite' }} />
          )}
        </Box>
      </Paper>
    </Fade>
  );
};

const StatusChips = ({ conditions }) => (
  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
    {conditions.map((condition, idx) => (
      <Chip
        key={idx}
        label={condition}
        icon={<LocalHospital sx={{ fontSize: 16 }} />}
        sx={{
          bgcolor: 'rgba(220, 38, 38, 0.08)',
          color: '#dc2626',
          fontWeight: 600,
          borderRadius: '8px',
          '& .MuiChip-label': { 
            px: 2,
            py: 0.75
          },
          '&:hover': {
            bgcolor: 'rgba(220, 38, 38, 0.15)',
          }
        }}
      />
    ))}
  </Box>
);

const DynamicAnalysis = ({ summary }) => {
  if (!summary?.ClinicalDocumentation?.Sections) {
    return <Typography>No data available</Typography>;
  }

  const sections = summary.ClinicalDocumentation.Sections;
  
  // Extract key metrics for vital cards
  const vitals = sections.find(s => s.SectionName === 'DIAGNOSTIC_TESTING')?.Summary || [];
  const assessment = sections.find(s => s.SectionName === 'ASSESSMENT')?.Summary || [];

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: 1200, 
      mx: 'auto',
      bgcolor: '#f8fafc',
      borderRadius: 3,
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <LocalHospital 
            sx={{ 
              fontSize: 32, 
              mr: 2, 
              color: 'primary.main',
              animation: 'fadeIn 0.5s ease-in'
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1e293b', 
              fontWeight: 800,
              letterSpacing: '-0.5px'
            }}
          >
            Clinical Analysis Report
          </Typography>
        </Box>
        <StatusChips 
          conditions={assessment.map(a => a.SummarizedSegment)}
        />
      </Box>

      {/* Vital Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {vitals.map((vital, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <VitalCard
              title={vital.SummarizedSegment.split(':')[0]}
              value={vital.SummarizedSegment.split(':')[1]}
              isAbnormal={vital.SummarizedSegment.toLowerCase().includes('high')}
            />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Primary Information */}
        <Grid item xs={12} md={8}>
          {sections
            .filter(section => ['CHIEF_COMPLAINT', 'HISTORY_OF_PRESENT_ILLNESS', 'ASSESSMENT']
              .includes(section.SectionName))
            .map((section, idx) => (
              <SectionRenderer 
                key={idx}
                section={section.SectionName}
                data={section.Summary}
              />
            ))}
        </Grid>

        {/* Right Column - Supporting Information */}
        <Grid item xs={12} md={4}>
          {sections
            .filter(section => ['PLAN', 'DIAGNOSTIC_TESTING', 'REVIEW_OF_SYSTEMS']
              .includes(section.SectionName))
            .map((section, idx) => (
              <SectionRenderer 
                key={idx}
                section={section.SectionName}
                data={section.Summary}
              />
            ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DynamicAnalysis;
