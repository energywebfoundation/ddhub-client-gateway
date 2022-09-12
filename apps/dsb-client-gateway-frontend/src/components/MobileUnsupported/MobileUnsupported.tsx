import { Box, Hidden, Typography } from '@mui/material';

export const MobileUnsupported = () => {
  return (
    <Hidden mdUp implementation="css">
      <Box display='flex' justifyContent='center' alignItems='center' height={800}>
        <Box>
          <Typography>Mobile is not supported in this viewport</Typography>
        </Box>
      </Box>
    </Hidden>
  );
};
