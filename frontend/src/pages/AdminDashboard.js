import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  Fade
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getAssets, getRequests } from '../services/api';

const StatCard = ({ title, value, icon, color, percentage }) => {
  const theme = useTheme();
  
  return (
    <Fade in timeout={800}>
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
          color: 'white',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="medium">
                {title}
              </Typography>
              <Typography variant="h4" py={2}>
                {value}
              </Typography>
            </Box>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>
          {percentage !== undefined && (
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Usage</Typography>
                <Typography variant="body2">{percentage}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ assets: 0, available: 0, requests: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsRes, requestsRes] = await Promise.all([
        getAssets(),
        getRequests()
      ]);
      
      const totalAssets = assetsRes.data.length;
      const availableAssets = assetsRes.data.filter(a => a.status === 'Available').length;
      
      setStats({
        assets: totalAssets,
        available: availableAssets,
        requests: requestsRes.data.filter(r => r.status === 'Pending').length,
        usagePercentage: totalAssets ? Math.round((totalAssets - availableAssets) / totalAssets * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Assets"
            value={loading ? '-' : stats.assets}
            icon={<InventoryIcon sx={{ fontSize: 40 }} />}
            color="primary"
            percentage={stats.usagePercentage}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Available Assets"
            value={loading ? '-' : stats.available}
            icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Requests"
            value={loading ? '-' : stats.requests}
            icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;