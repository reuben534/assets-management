import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  useTheme,
  Fade,
  Grid,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon
} from '@mui/icons-material';

const StatItem = ({ icon, label, value, total, color }) => {
  const theme = useTheme();
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight="600">
            {value}
          </Typography>
        </Box>
        {total && (
          <Tooltip title={`${percentage}% of total`} arrow>
            <Typography variant="body2" color="text.secondary">
              {percentage}%
            </Typography>
          </Tooltip>
        )}
      </Box>
      {total && (
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette[color].light,
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              backgroundColor: theme.palette[color].main
            }
          }}
        />
      )}
    </Box>
  );
};

const ReportCard = ({ report }) => {
  const content = JSON.parse(report.content);
  const total = content.totalAssets;

  return (
    <Fade in timeout={500}>
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 8
          }
        }}
      >
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    color: 'primary.main'
                  }}
                >
                  <PersonIcon />
                </Box>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" fontWeight="600">
                  {report.generatedBy.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(report.generatedDate).toLocaleDateString()} at{' '}
                    {new Date(report.generatedDate).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          <StatItem
            icon={<InventoryIcon />}
            label="Total Assets"
            value={content.totalAssets}
            color="primary"
          />

          <StatItem
            icon={<CheckCircleIcon />}
            label="Available"
            value={content.available}
            total={total}
            color="success"
          />

          <StatItem
            icon={<AssignmentIcon />}
            label="Assigned"
            value={content.assigned}
            total={total}
            color="info"
          />

          <StatItem
            icon={<BuildIcon />}
            label="Under Maintenance"
            value={content.underMaintenance}
            total={total}
            color="warning"
          />
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ReportCard;