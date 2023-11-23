import { FC } from 'react';
import {
  Backdrop as MaterialBackdrop,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useStyles } from './Backdrop.styles';
import { alpha } from '@mui/material/styles';
import { useBackdropContext } from '@ddhub-client-gateway-frontend/ui/context';

export const Backdrop: FC = () => {
  const { isLoading } = useBackdropContext();
  const { classes, theme } = useStyles();
  return (
    <MaterialBackdrop open={isLoading} className={classes.root}>
      <Box className={classes.wrapper}>
        <svg style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="100%">
              <stop offset="5%" stopColor={theme.palette.primary.main} />
              <stop
                offset="95%"
                stopColor={alpha(theme.palette.primary.main, 0.35)}
              />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          size={75}
          thickness={2}
          disableShrink
          sx={{ 'svg circle': { stroke: 'url(#gradient)' } }}
        />
        <Box className={classes.logoWrapper}>
          <img src="/ew-logo.svg" alt="logo" className={classes.logo} />
        </Box>
      </Box>
      <Box>
        <Typography variant="body2" className={classes.text}>
          Loading...
        </Typography>
      </Box>
    </MaterialBackdrop>
  );
};
