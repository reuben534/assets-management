import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  useTheme,
  Fade,
  CircularProgress,
  FormHelperText,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const RequestForm = ({ assets, onSubmit, disabled }) => {
  const [assetID, setAssetID] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const availableAssets = assets.filter(a => a.status === 'Available');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetID) {
      setError('Please select an asset');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onSubmit({ assetID });
      setAssetID('');
    } catch (error) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!availableAssets.length) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          color: 'text.secondary',
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <InventoryIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Available Assets
        </Typography>
        <Typography variant="body2">
          There are currently no assets available for request.
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={2}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Request an Asset
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an asset from the list below to submit a request.
          </Typography>
        </Box>

        <FormControl 
          fullWidth 
          error={!!error}
          disabled={disabled || loading}
        >
          <InputLabel id="asset-select-label">
            Select Asset
          </InputLabel>
          <Select
            labelId="asset-select-label"
            value={assetID}
            onChange={(e) => {
              setAssetID(e.target.value);
              setError('');
            }}
            label="Select Asset"
            startAdornment={
              <InventoryIcon sx={{ ml: 1, mr: 1, color: 'action.active' }} />
            }
          >
            <MenuItem value="" disabled>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                Choose an asset
              </Box>
            </MenuItem>
            {availableAssets.map((asset) => (
              <MenuItem 
                key={asset._id} 
                value={asset._id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <Tooltip 
                  title={asset.description || 'No description available'} 
                  arrow 
                  placement="right"
                >
                  <Box>
                    <Typography variant="body1">
                      {asset.name}
                    </Typography>
                    {asset.categoryID?.categoryName && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {asset.categoryID.categoryName}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};

export default RequestForm;