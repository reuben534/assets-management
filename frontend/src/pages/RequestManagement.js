import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Event as EventIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Settings as StatusIcon
} from '@mui/icons-material';
import { getRequests, updateRequest } from '../services/api';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getRequests();
        setRequests(data || []);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(id);
    setError('');
    try {
      await updateRequest(id, status);
      setRequests(requests.map(r => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Failed to update request. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Pending: { color: 'warning', icon: <StatusIcon sx={{ fontSize: 16 }} /> },
      Approved: { color: 'success', icon: <ApproveIcon sx={{ fontSize: 16 }} /> },
      Rejected: { color: 'error', icon: <RejectIcon sx={{ fontSize: 16 }} /> }
    };

    const config = statusConfig[status] || statusConfig.Pending;

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        sx={{
          '& .MuiChip-icon': {
            color: 'inherit'
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Request Management
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {!requests.length ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={6}
            sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
          >
            <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Requests Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New requests will appear here
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2">User</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <InventoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2">Asset</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StatusIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2">Status</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2">Date</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow
                    key={req._id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography>{req.userID ? req.userID.name : 'Unknown User'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{req.assetID ? req.assetID.name : 'Unknown Asset'}</Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(req.status)}
                    </TableCell>
                    <TableCell>
                      <Typography>{new Date(req.requestDate).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      {req.status === 'Pending' && (
                        <Box>
                          <Tooltip title="Approve Request">
                            <IconButton
                              color="success"
                              onClick={() => handleAction(req._id, 'Approved')}
                              disabled={actionLoading === req._id}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              {actionLoading === req._id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <ApproveIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject Request">
                            <IconButton
                              color="error"
                              onClick={() => handleAction(req._id, 'Rejected')}
                              disabled={actionLoading === req._id}
                              size="small"
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Fade>
  );
};

export default RequestManagement;