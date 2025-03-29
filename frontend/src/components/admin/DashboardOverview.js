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
  Person as PersonIcon,
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
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
    totalUsers: 0,
    totalViews: 0,
    recentPapers: [],
    topPapers: [],
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
        
        // Create monthly stats if not available
        let processedMonthlyStats = paperStats.monthlyUploads || [];
        if (!processedMonthlyStats.length && paperStats.papers) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthCounts = Array(12).fill(0);
          
          paperStats.papers.forEach(paper => {
            if (paper.createdAt) {
              const date = new Date(paper.createdAt);
              const month = date.getMonth();
              monthCounts[month]++;
            }
          });
          
          processedMonthlyStats = months.map((month, index) => ({
            month,
            count: monthCounts[index]
          }));
        }
        
        setStats({
          totalPapers: paperStats.totalPapers || 0,
          totalUsers: userStats.totalUsers || 0,
          totalViews: paperStats.totalViews || 0,
          recentPapers: paperStats.recentPapers || [],
          topPapers: paperStats.topPapers || [],
          monthlyUploads: processedMonthlyStats
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

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title="Total Papers" 
            value={stats.totalPapers} 
            icon={<DescriptionIcon />} 
            color="#3f51b5" 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<PersonIcon />} 
            color="#9c27b0" 
          />
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
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
            <Paper sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary">
                No monthly data available
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Recent Papers */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">Recent Papers</Typography>
            </Box>
            {stats.recentPapers.length === 0 ? (
              <Box p={3} textAlign="center">
                <Typography color="text.secondary">No recent papers</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {stats.recentPapers.map((paper, index) => (
                  <React.Fragment key={paper._id || index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: paper.approved ? 'success.main' : 'warning.main' }}>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={paper.title}
                        secondary={
                          <>
                            {`${paper.subject || 'Unknown subject'} • ${formatDate(paper.createdAt)}`}
                            <br />
                            <Chip 
                              label={paper.approved ? 'Approved' : 'Pending'} 
                              size="small" 
                              color={paper.approved ? 'success' : 'warning'}
                              sx={{ mt: 0.5 }}
                            />
                          </>
                        }
                      />
                    </ListItem>
                    {index < stats.recentPapers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Top Papers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="h6">Most Popular Papers</Typography>
            </Box>
            {stats.topPapers.length === 0 ? (
              <Box p={3} textAlign="center">
                <Typography color="text.secondary">No paper statistics available</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {stats.topPapers.map((paper, index) => (
                  <React.Fragment key={paper._id || index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={paper.title}
                        secondary={
                          <>
                            {`${paper.subject || 'Unknown subject'} • ${paper.department || 'Unknown department'}`}
                            <br />
                            {`${paper.views || 0} views`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < stats.topPapers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 