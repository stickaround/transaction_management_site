import { Backdrop, CircularProgress } from '@mui/material';

function Loader() {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress />
    </Backdrop>
  );
}

export { Loader };
