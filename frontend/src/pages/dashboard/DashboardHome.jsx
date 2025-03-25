import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  EventNote,
  LocalHospital,
  Assessment
} from '@mui/icons-material';
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

const RecentPatients = ({ loading }) => {
  if (loading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  const patients = [
    { id: 1, name: 'John Doe', date: '2023-05-15', status: 'Completed' },
    { id: 2, name: 'Jane Smith', date: '2023-05-16', status: 'Scheduled' },
    { id: 3, name: 'Robert Johnson', date: '2023-05-17', status: 'Completed' },
    { id: 4, name: 'Emily Davis', date: '2023-05-18', status: 'Cancelled' },
    { id: 5, name: 'Michael Brown', date: '2023-05-19', status: 'Scheduled' },
  ];

  return (
    <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
      <CardHeader 
        title="Recent Patients" 
        action={
          <Button color="primary" size="small">
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
                  Name
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
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {patient.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'Completed' ? 'bg-green-800 text-green-100' :
                      patient.status === 'Scheduled' ? 'bg-blue-800 text-blue-100' :
                      'bg-red-800 text-red-100'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-400 cursor-pointer">
                    View Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </CardContent>
    </Card>
  );
};

const UpcomingAppointments = ({ loading }) => {
  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <Card sx={{ bgcolor: '#1f2937', borderRadius: 2, border: '1px solid #374151' }}>
      <CardHeader 
        title="Upcoming Appointments" 
        action={
          <Button color="primary" size="small">
            View Calendar
          </Button>
        }
        sx={{ 
          color: 'white',
          '& .MuiCardHeader-action': { color: '#60a5fa' }
        }}
      />
      <Divider sx={{ borderColor: '#374151' }} />
      <CardContent>
        <Box className="space-y-3">
          {[1, 2, 3].map((item) => (
            <Box 
              key={item}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-700 hover:border-blue-500"
            >
              <Box className="flex items-center">
                <Box className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
                  <Typography className="text-blue-200 font-medium">
                    {10 + item}
                  </Typography>
                </Box>
                <Box className="ml-4">
                  <Typography className="text-sm font-medium text-white">
                    Patient {item}
                  </Typography>
                  <Typography className="text-xs text-gray-400">
                    {item === 1 ? 'Today' : item === 2 ? 'Tomorrow' : 'In 2 days'}, 10:{item}0 AM
                  </Typography>
                </Box>
              </Box>
              <Button size="small" variant="outlined" sx={{ borderRadius: 4 }}>
                Details
              </Button>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
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
          startIcon={<Assessment />}
          sx={{ borderRadius: 2 }}
        >
          Generate Report
        </Button>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Total Patients" 
            value="384" 
            icon={<People />}
            change={12.5} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Appointments" 
            value="28" 
            icon={<EventNote />}
            change={-3.6} 
            color="info" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Diagnoses" 
            value="156" 
            icon={<LocalHospital />}
            change={8.2} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard 
            loading={loading}
            title="Completed" 
            value="95%" 
            icon={<Assessment />}
            change={4.1} 
            color="warning" 
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <RecentPatients loading={loading} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UpcomingAppointments loading={loading} />
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardHome;
