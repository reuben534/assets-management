import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  Fade,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Circle as StatusIcon
} from '@mui/icons-material';

const StatusChip = ({ status }) => {
  const statusConfig = {
    Available: { color: 'success', icon: true },
    'In Use': { color: 'primary', icon: true },
    'Under Maintenance': { color: 'warning', icon: true },
    'Out of Service': { color: 'error', icon: true }
  };

  const config = statusConfig[status] || { color: 'default', icon: false };

  return (
    <Chip
      label={status}
      color={config.color}
      size="small"
      icon={config.icon ? <StatusIcon /> : undefined}
      sx={{
        '& .MuiChip-icon': {
          fontSize: 16
        }
      }}
    />
  );
};

const AssetList = ({ assets, onEdit, onDelete }) => {
  const theme = useTheme();

  if (!assets?.length) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          color: 'text.secondary'
        }}
      >
        <Typography variant="body1">
          No assets found
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <TableContainer 
        component={Paper} 
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.palette.primary.main,
                '& th': {
                  color: 'white',
                  fontWeight: 600
                }
              }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              {(onEdit || onDelete) && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset._id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight={500}>
                    {asset.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {asset.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={asset.status} />
                </TableCell>
                <TableCell>
                  {asset.locationID?.locationName || '-'}
                </TableCell>
                <TableCell>
                  {asset.categoryID?.categoryName || '-'}
                </TableCell>
                {(onEdit || onDelete) && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {onEdit && (
                        <Tooltip title="Edit Asset" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onEdit(asset)}
                            sx={{
                              color: theme.palette.warning.main,
                              '&:hover': {
                                backgroundColor: theme.palette.warning.light
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Delete Asset" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(asset._id)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fade>
  );
};

export default AssetList;