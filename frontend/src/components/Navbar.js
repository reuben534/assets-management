import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Divider,
  ListItemIcon,
  useTheme,
  Fade,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  const token = localStorage.getItem('token');
  let role = null;
  let username = null;

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
    username = decoded.name;
  }

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenu = (event) => setMobileAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    handleClose();
    navigate('/');
  };

  const menuItems = role === 'Admin' ? [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
    { text: 'Assets', icon: <InventoryIcon />, path: '/assets' },
    { text: 'Users', icon: <GroupIcon />, path: '/users' },
    { text: 'Requests', icon: <AssignmentIcon />, path: '/requests' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' }
  ] : [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/employee-dashboard' }
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
      }}
    >
      <Toolbar>
        {/* Brand */}
        <Box 
          component={Link} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <InventoryIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              letterSpacing: '.1rem'
            }}
          >
            Asset Management
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {token ? (
            <>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    mx: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Tooltip title="Account settings" arrow>
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                    {username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {token && (
            <>
              <IconButton
                color="inherit"
                onClick={handleMobileMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileAnchorEl}
                open={Boolean(mobileAnchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    component={Link}
                    to={item.path}
                    onClick={handleClose}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    {item.text}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomNavbar;