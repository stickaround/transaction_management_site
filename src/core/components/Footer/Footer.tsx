import { Box, CssBaseline, Paper, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#1976d2',
          height: '60px',
        }}
        elevation={3}
      >
        <Typography
          sx={{ textAlign: 'center', color: 'white', marginTop: '15px' }}
        >
          Tony Ming, 2022
        </Typography>
      </Paper>
    </Box>
  );
}

export { Footer };
