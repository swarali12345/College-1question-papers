import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  FileCopy as FileIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  ThumbUp as ThumbUpIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { paperService, userService } from '../../services/adminService';
import Chart from 'react-apexcharts';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderTop: `4px solid ${color}`
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );
};

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPapers: 0,
    approvedPapers: 0,
    pendingPapers: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalViews: 0,
    recentPapers: [],
    topPapers: [],
    departmentStats: [],
    monthlyUploads: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch paper stats
        const paperStats = await paperService.getPaperStats();
        
        // Fetch user stats
        const userStats = await userService.getUserStats();
        
        setStats({
          totalPapers: paperStats.totalPapers || 0,
          approvedPapers: paperStats.approvedPapers || 0,
          pendingPapers: paperStats.pendingPapers || 0,
          totalUsers: userStats.totalUsers || 0,
          totalDownloads: paperStats.totalDownloads || 0,
          totalViews: paperStats.totalViews || 0,
          recentPapers: paperStats.recentPapers || [],
          topPapers: paperStats.topPapers || [],
          departmentStats: paperStats.departmentStats || [],
          monthlyUploads: paperStats.monthlyUploads || []
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const chartOptions = {
    chart: {
      id: 'department-papers',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: stats.departmentStats.map(item => item.department)
    },
    colors: ['#4caf50'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px'
      }
    },
    title: {
      text: 'Papers by Department',
      align: 'center',
      style: {
        fontSize: '16px'
      }
    }
  };

  const uploadsTrendOptions = {
    chart: {
      id: 'monthly-uploads',
      toolbar: {
        show: false
      },
      type: 'area'
    },
    xaxis: {
      categories: stats.monthlyUploads.map(item => item.month)
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#3f51b5'],
    title: {
      text: 'Monthly Uploads',
      align: 'center',
      style: {
        fontSize: '16px'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Papers" 
            value={stats.totalPapers} 
            icon={<DescriptionIcon />} 
            color="#3f51b5" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Approvals" 
            value={stats.pendingPapers} 
            icon={<FileIcon />} 
            color="#f44336" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<PersonIcon />} 
            color="#9c27b0" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Downloads" 
            value={stats.totalDownloads} 
            icon={<ThumbUpIcon />} 
            color="#4caf50" 
          />
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          {stats.departmentStats.length > 0 ? (
            <Paper sx={{ p: 2 }}>
              <Chart 
                options={chartOptions} 
                series={[{
                  name: 'Papers',
                  data: stats.departmentStats.map(item => item.count)
                }]} 
                type="bar" 
                height={350} 
              />
            </Paper>
          ) : (
            <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No department data available
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {stats.monthlyUploads.length > 0 ? (
            <Paper sx={{ p: 2 }}>
              <Chart 
                options={uploadsTrendOptions} 
                series={[{
                  name: 'Uploads',
                  data: stats.monthlyUploads.map(item => item.count)
                }]} 
                type="area" 
                height={350} 
              />
            </Paper>
          ) : (
            <Paper sx={{ p: 3, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No monthly upload data available
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Recent & Top Papers */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Uploads
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentPapers.length > 0 ? (
              <List>
                {stats.recentPapers.map((paper) => (
                  <ListItem key={paper.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={paper.title}
                      secondary={
                        <>
                          {paper.subject} | {format(new Date(paper.createdAt), 'dd MMM yyyy')}
                          <Box display="flex" mt={0.5}>
                            <Chip 
                              size="small" 
                              label={paper.status} 
                              color={paper.status === 'approved' ? 'success' : 'warning'} 
                              sx={{ mr: 1 }}
                            />
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No recent uploads
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Downloaded Papers
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.topPapers.length > 0 ? (
              <List>
                {stats.topPapers.map((paper) => (
                  <ListItem key={paper.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <ThumbUpIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={paper.title}
                      secondary={
                        <>
                          {paper.subject} | {paper.department}
                          <Box display="flex" mt={0.5}>
                            <Chip 
                              size="small" 
                              label={`${paper.downloads} downloads`} 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No download data available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 