import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Fade,
  Link as MuiLink
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle as UserIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { login } from '../../services/api';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          navigate(decoded.role === 'Admin' ? '/admin-dashboard' : '/employee-dashboard');
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Decode token to get user info
      const decoded = jwtDecode(token);
      const user = {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate(decoded.role === 'Admin' ? '/admin-dashboard' : '/employee-dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Fade in>
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Box mb={3} textAlign="center">
              <UserIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{ email: '', password: '', rememberMe: false }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UserIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={values.rememberMe}
                          onChange={handleChange}
                          color="primary"
                        />
                      }
                      label="Remember me"
                    />
                    <MuiLink
                      component={Link}
                      to="/forgot-password"
                      underline="hover"
                      sx={{ color: 'primary.main' }}
                    >
                      Forgot Password?
                    </MuiLink>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
};

export default Login;
