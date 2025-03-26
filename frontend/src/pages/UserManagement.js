import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
  Alert,
  Grid,
  Stack
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  VpnKey as PasswordIcon,
  Badge as RoleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getUsers, addUser, updateUser, deleteUser } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getUsers();
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setFormData(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    setError('');
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      if (formData._id) {
        await updateUser(formData._id, formData);
        setUsers(users.map(u => (u._id === formData._id ? { ...u, ...formData } : u)));
      } else {
        const { data } = await addUser(formData);
        setUsers([...users, data]);
      }
      setShowModal(false);
      setFormData({});
    } catch (err) {
      console.error('Error submitting user:', err);
      setError('Failed to save user. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
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
          <GroupIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            User Management
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowModal(true)}
          sx={{
            mb: 3,
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          Add User
        </Button>

        {!users.length ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={6}
            sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
          >
            <GroupIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Users Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a new user to get started
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
                      <Typography variant="subtitle2">Name</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2">Email</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <RoleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2">Role</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography>{user.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{user.role}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(user)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user._id)}
                            disabled={deleteLoading === user._id}
                            size="small"
                          >
                            {deleteLoading === user._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 2,
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2
          }}>
            <Box display="flex" alignItems="center">
              {formData._id ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
              <Typography variant="h6">
                {formData._id ? 'Edit User' : 'Add User'}
              </Typography>
            </Box>
            <IconButton onClick={() => setShowModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!formData._id}
                    InputProps={{
                      startAdornment: <PasswordIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role || 'User'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      label="Role"
                      startAdornment={<RoleIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowModal(false)}
                      sx={{ mr: 2, borderRadius: 2, textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitLoading}
                      startIcon={submitLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                      {submitLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default UserManagement;