import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Grid, 
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Mic,
  Description,
  Assessment,
  CloudUpload,
  Check,
  AccessTime
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { StatCardSkeleton, TableSkeleton, CardSkeleton } from '../../components/ui/Skeleton';

const StatsCard = ({ title, value, icon, change, color, loading }) => {
  if (loading) {
    return <StatCardSkeleton />;
  }

  return (
    <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', my: 1, fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Box display="flex" alignItems="center">
              {change >= 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: '1rem', mr: 0.5 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: change >= 0 ? 'success.main' : 'error.main',
                  fontSize: '0.75rem'
                }}
              >
                {change >= 0 ? '+' : ''}{change}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5, fontSize: '0.75rem' }}>
                from last month
              </Typography>
            </Box>
          </Box>
          <Box 
            sx={{ 
              bgcolor: `${color}.dark`, 
              color: `${color}.main`,
              p: 1.5, 
              borderRadius: 2 
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RecentTranscripts = ({ loading: initialLoading }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/doctor-api/get-recent-patients`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        setTranscripts(response.data.data || []);
        console.log('Fetched recent transcripts:', transcripts );
      } catch (error) {
        console.error('Error fetching recent transcripts:', error);
        setError('Failed to load recent transcripts');
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, []);

  if (loading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  if (error) {
    return (
      <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
      <CardHeader 
        title="Recent Transcripts" 
        action={
          <Button color="primary" size="small" component={Link} to="/dashboard/transcripts">
            View All
          </Button>
        }
        sx={{ 
          color: 'white',
          '& .MuiCardHeader-action': { color: '#60a5fa' }
        }}
      />
      <Divider sx={{ borderColor: '#374151' }} />
      <CardContent>
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Purpose of visit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transcripts.map((transcript) => (
                <tr key={transcript.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {transcript.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {transcript.purpose || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(transcript.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Chip 
                      label={transcript.status} 
                      size="small"
                      icon={
                        transcript.status === 'Completed' ? <Check fontSize="small" /> :
                        transcript.status === 'Processing' ? <AccessTime fontSize="small" /> : null
                      }
                      sx={{
                        bgcolor: 
                          transcript.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' :
                          transcript.status === 'Processing' ? 'rgba(59, 130, 246, 0.2)' :
                          'rgba(239, 68, 68, 0.2)',
                        color: 
                          transcript.status === 'Completed' ? 'rgb(16, 185, 129)' :
                          transcript.status === 'Processing' ? 'rgb(59, 130, 246)' :
                          'rgb(239, 68, 68)',
                        borderRadius: '4px',
                        '& .MuiChip-label': { px: 1 },
                        '& .MuiChip-icon': { color: 'inherit' }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-400 cursor-pointer">
                    <Link to={`/dashboard/transcripts/${transcript.id}`}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {transcripts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    No recent transcripts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProcessingQueue = ({ loading }) => {
  if (loading) {
    return <CardSkeleton />;
  }

  const queuedItems = [
    { id: 1, patientName: 'Alice Johnson', progress: 75 },
    { id: 2, patientName: 'Bob Williams', progress: 30 },
    { id: 3, patientName: 'Carol Martinez', progress: 90 }
  ];

  return (
    <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
      <CardHeader 
        title="Processing Queue" 
        action={
          <Button color="primary" size="small" component={Link} to="/dashboard/patients">
            Upload New
          </Button>
        }
        sx={{ 
          color: 'white',
          '& .MuiCardHeader-action': { color: '#60a5fa' }
        }}
      />
      <Divider sx={{ borderColor: '#374151' }} />
      <CardContent>
        <Box className="space-y-4">
          {queuedItems.map((item) => (
            <Box 
              key={item.id}
              className="p-3 rounded-lg border border-gray-700 hover:border-blue-500"
            >
              <Box className="flex justify-between items-center mb-2">
                <Typography className="text-sm font-medium text-white">
                  {item.patientName}
                </Typography>
                <Typography className="text-xs text-gray-400">
                  {item.progress}% complete
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={item.progress} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#3b82f6',
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          ))}
          {queuedItems.length === 0 && (
            <Box className="text-center py-6">
              <Typography className="text-gray-400">
                No recordings currently processing
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/doctor-api/get-patients`, 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        console.log('Fetched patients:', response.data.data);
        setPatientCount(response.data.data?.length || 0);
      } catch (error) {
        console.error('Error fetching patient count:', error);
        setPatientCount(0);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
          Dashboard Overview
        </Typography>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          component={Link}
          to="/dashboard/recordings"
          sx={{ borderRadius: 2 }}
        >
          Upload Recording
        </Button>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Total Patients" 
            value={patientCount.toString()} 
            icon={<People />}
            change={12.5} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Recordings" 
            value="142" 
            icon={<Mic />}
            change={28.4} 
            color="info" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Transcripts" 
            value="128" 
            icon={<Description />}
            change={18.2} 
            color="success" 
          />
        </Grid>
        

        <Grid item xs={12} lg={8}>
          <RecentTranscripts loading={loading} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ProcessingQueue loading={loading} />
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardHome;
