import React, { useState } from 'react';
import { Box, Typography, Paper, Fade, Grid, Modal, IconButton, Backdrop } from '@mui/material';
import { Description, Assessment, Close, HealthAndSafety } from '@mui/icons-material';

const DetailModal = ({ open, onClose, title, content }) => (
  <Modal
    open={open}
    onClose={onClose}
    closeAfterTransition
    slots={{ backdrop: Backdrop }}
    slotProps={{
      backdrop: {
        timeout: 500,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
        }
      }
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Fade in={open}>
      <Box sx={{
        width: '90vw',
        maxWidth: 800,
        maxHeight: '90vh',
        bgcolor: '#1a1a1a',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Box sx={{
          p: 3,
          background: 'linear-gradient(45deg, #1e3a8a 0%, #1e40af 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HealthAndSafety sx={{ color: '#fff' }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{
          p: 3,
          maxHeight: 'calc(90vh - 100px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4b5563',
            borderRadius: '4px',
          },
        }}>
          {Array.isArray(content) ? content.map((item, idx) => (
            <Typography
              key={idx}
              sx={{
                color: '#e2e8f0',
                mb: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderLeft: '3px solid #3b82f6',
                fontSize: '0.95rem',
                fontFamily: '"Roboto Mono", monospace',
              }}
            >
              {item}
            </Typography>
          )) : (
            <Typography sx={{ color: '#e2e8f0' }}>{content}</Typography>
          )}
        </Box>
      </Box>
    </Fade>
  </Modal>
);

const SummarySection = ({ title, content, index }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Grid item xs={12} sm={6} lg={4}>
        <Fade in timeout={500} style={{ transitionDelay: `${index * 150}ms` }}>
          <Paper
            elevation={3}
            onClick={() => setModalOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              p: 3,
              height: 280,
              borderRadius: '12px',
              cursor: 'pointer',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(33, 150, 243, 0.4)'
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(33, 150, 243, 0)'
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(33, 150, 243, 0)'
                }
              },
              '@keyframes borderGlow': {
                '0%': {
                  borderColor: 'primary.light'
                },
                '50%': {
                  borderColor: 'primary.main'
                },
                '100%': {
                  borderColor: 'primary.light'
                }
              },
              animation: 'pulse 2s infinite',
              border: '1px solid',
              borderColor: 'primary.light',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                opacity: isHovered ? 1 : 0.7,
                transition: 'all 0.3s ease'
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 12px 24px rgba(33, 150, 243, 0.2)',
                animation: 'borderGlow 1.5s infinite',
                '& .icon-container': {
                  transform: 'scale(1.1) rotate(10deg)',
                }
              },
              '& .icon-container': {
                transition: 'transform 0.3s ease',
              }
            }}
          >
            {/* Card Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              pb: 2,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Box className="icon-container">
                <Assessment sx={{ 
                  color: 'primary.main',
                  fontSize: 28,
                  mr: 1.5,
                  filter: isHovered ? 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))' : 'none',
                  transition: 'filter 0.3s ease'
                }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {title}
              </Typography>
            </Box>

            {/* Card Content */}
            <Box className="content-container" sx={{ 
              flex: 1,
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              p: 2,
            }}>
              {Array.isArray(content) ? (
                content.map((item, idx) => (
                  <Typography 
                    key={idx} 
                    sx={{ 
                      color: 'text.secondary',
                      py: 1,
                      px: 1.5,
                      mb: 1,
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      backgroundColor: 'background.paper',
                      borderLeft: '3px solid',
                      borderColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>
                  {content}
                </Typography>
              )}
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 1, 
                display: 'block', 
                textAlign: 'center',
                color: 'primary.main',
                fontWeight: 500,
                opacity: isHovered ? 1 : 0.7,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              Click to view full details
            </Typography>
          </Paper>
        </Fade>
      </Grid>
      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        content={content}
      />
    </>
  );
};

const DynamicAnalysis = ({ summary }) => {
  if (!summary?.ClinicalDocumentation?.Sections) {
    return <Typography>No data available</Typography>;
  }

  // Group items by section name
  const groupedSections = summary.ClinicalDocumentation.Sections.reduce((acc, section) => {
    if (!section.SectionName || !section.Summary) return acc;
    
    const title = section.SectionName.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');

    if (!acc[title]) {
      acc[title] = [];
    }

    const summaryContent = section.Summary.map(item => 
      item.SummarizedSegment || item.content || item
    );

    acc[title].push(...summaryContent);
    return acc;
  }, {});

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        {Object.entries(groupedSections).map(([title, content], idx) => (
          <SummarySection
            key={idx}
            title={title}
            content={content}
            index={idx}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default DynamicAnalysis;
