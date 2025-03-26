import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  InputAdornment,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Email as EmailIcon } from '@mui/icons-material';
import { forgotPassword } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
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
              <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success ? (
              <Box textAlign="center">
                <Alert severity="success" sx={{ mb: 3 }}>
                  Password reset instructions have been sent to your email.
                </Alert>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please check your email and follow the instructions to reset your password.
                </Typography>
                <MuiLink
                  component={Link}
                  to="/login"
                  underline="hover"
                  sx={{ color: 'primary.main', mt: 2, display: 'inline-block' }}
                >
                  Return to Login
                </MuiLink>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    mb: 2
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <Box textAlign="center">
                  <MuiLink
                    component={Link}
                    to="/login"
                    underline="hover"
                    sx={{ color: 'primary.main' }}
                  >
                    Back to Login
                  </MuiLink>
                </Box>
              </form>
            )}
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
};

export default ForgotPassword;
