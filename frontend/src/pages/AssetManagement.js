import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Grid,
  Fade,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  BuildCircle as StatusIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AssetList from '../components/AssetList';
import { getAssets, addAsset, updateAsset, deleteAsset, getLocations, getCategories, getSuppliers } from '../services/api';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [
          { data: assetData },
          { data: locData },
          { data: catData },
          { data: supData }
        ] = await Promise.all([
          getAssets(),
          getLocations(),
          getCategories(),
          getSuppliers()
        ]);
        setAssets(assetData);
        setLocations(locData);
        setCategories(catData);
        setSuppliers(supData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (asset) => {
    setFormData(asset);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAsset(id);
      setAssets(assets.filter(a => a._id !== id));
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete asset. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      if (formData._id) {
        await updateAsset(formData._id, formData);
        setAssets(assets.map(a => (a._id === formData._id ? formData : a)));
      } else {
        const { data } = await addAsset(formData);
        setAssets([...assets, data]);
      }
      setShowModal(false);
      setFormData({});
    } catch (err) {
      console.error('Error submitting asset:', err);
      setError('Failed to save asset. Please try again.');
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
          <InventoryIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Asset Management
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
          Add Asset
        </Button>

        <AssetList assets={assets} onEdit={handleEdit} onDelete={handleDelete} />

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
                {formData._id ? 'Edit Asset' : 'Add Asset'}
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
                      startAdornment: <InventoryIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Purchase Date"
                    value={formData.purchaseDate ? new Date(formData.purchaseDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <EventIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Warranty Date"
                    value={formData.warrantyDate ? new Date(formData.warrantyDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, warrantyDate: e.target.value })}
                    InputProps={{
                      startAdornment: <EventIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={formData.locationID || ''}
                      onChange={(e) => setFormData({ ...formData, locationID: e.target.value })}
                      label="Location"
                      startAdornment={<LocationIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="">
                        <em>Select Location</em>
                      </MenuItem>
                      {locations.map((loc) => (
                        <MenuItem key={loc._id} value={loc._id}>
                          {loc.locationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.categoryID || ''}
                      onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
                      label="Category"
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="">
                        <em>Select Category</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      value={formData.supplierID || ''}
                      onChange={(e) => setFormData({ ...formData, supplierID: e.target.value })}
                      label="Supplier"
                      startAdornment={<BusinessIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="">
                        <em>Select Supplier</em>
                      </MenuItem>
                      {suppliers.map((sup) => (
                        <MenuItem key={sup._id} value={sup._id}>
                          {sup.supplierName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status || 'Available'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Status"
                      startAdornment={<StatusIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="Available">Available</MenuItem>
                      <MenuItem value="Assigned">Assigned</MenuItem>
                      <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
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

export default AssetManagement;