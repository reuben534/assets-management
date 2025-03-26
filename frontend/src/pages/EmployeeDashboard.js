import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
  Fade,
  Collapse,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  BuildCircle as StatusIcon,
  Event as DateIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { getAssets, getRequests, addRequest } from '../services/api';
import AssetList from '../components/AssetList';
import RequestForm from '../components/RequestForm';

const StatusChip = ({ status }) => {
  const statusColors = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error',
    'In Progress': 'info'
  };

  return (
    <Chip
      label={status}
      color={statusColors[status] || 'default'}
      size="small"
      sx={{ 
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 2
        }
      }}
    />
  );
};

const SectionHeader = ({ icon, title, expandable, expanded, onToggle }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      cursor: expandable ? 'pointer' : 'default',
      '&:hover': expandable ? {
        color: 'primary.main'
      } : {}
    }}
    onClick={onToggle}
  >
    {React.cloneElement(icon, { sx: { mr: 1, fontSize: 28 } })}
    <Typography variant="h5" fontWeight="500">
      {title}
    </Typography>
    {expandable && (
      <IconButton
        size="small"
        sx={{
          ml: 1,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.3s'
        }}
      >
        <ExpandMoreIcon />
      </IconButton>
    )}
  </Box>
);

const LoadingSection = () => (
  <Box display="flex" justifyContent="center" alignItems="center" py={4}>
    <CircularProgress />
  </Box>
);

const EmployeeDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sections, setSections] = useState({
    assets: true,
    requestForm: true,
    requestList: true
  });

  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [assetData, requestData] = await Promise.all([
        getAssets(),
        getRequests()
      ]);
      setAssets(assetData.data);
      setRequests(requestData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = async (requestData) => {
    try {
      await addRequest(requestData);
      await fetchData();
    } catch (error) {
      console.error('Error submitting request:', error);
      setError('Failed to submit request. Please try again.');
    }
  };

  if (loading && !assets.length && !requests.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" mb={4}>
          Employee Dashboard
        </Typography>
        <LoadingSection />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={4}>
        Employee Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box mb={4}>
        <SectionHeader
          icon={<InventoryIcon />}
          title="Available Assets"
          expandable
          expanded={sections.assets}
          onToggle={() => toggleSection('assets')}
        />
        <Collapse in={sections.assets}>
          <Fade in={sections.assets} timeout={500}>
            <Box>
              {loading ? (
                <LoadingSection />
              ) : (
                <AssetList assets={assets.filter(a => a.status === 'Available')} />
              )}
            </Box>
          </Fade>
        </Collapse>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box mb={4}>
        <SectionHeader
          icon={<SendIcon />}
          title="Request an Asset"
          expandable
          expanded={sections.requestForm}
          onToggle={() => toggleSection('requestForm')}
        />
        <Collapse in={sections.requestForm}>
          <Fade in={sections.requestForm} timeout={500}>
            <Box>
              <RequestForm 
                assets={assets} 
                onSubmit={handleRequest}
                disabled={loading}
              />
            </Box>
          </Fade>
        </Collapse>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <SectionHeader
          icon={<AssignmentIcon />}
          title="My Requests"
          expandable
          expanded={sections.requestList}
          onToggle={() => toggleSection('requestList')}
        />
        <Collapse in={sections.requestList}>
          <Fade in={sections.requestList} timeout={500}>
            {loading ? (
              <LoadingSection />
            ) : (
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CategoryIcon sx={{ mr: 1 }} />
                          Asset
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <StatusIcon sx={{ mr: 1 }} />
                          Status
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DateIcon sx={{ mr: 1 }} />
                          Date
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography color="textSecondary">
                            No requests found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((req) => (
                        <TableRow 
                          key={req._id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <TableCell>{req.assetID.name}</TableCell>
                          <TableCell>
                            <StatusChip status={req.status} />
                          </TableCell>
                          <TableCell>
                            {new Date(req.requestDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Fade>
        </Collapse>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;