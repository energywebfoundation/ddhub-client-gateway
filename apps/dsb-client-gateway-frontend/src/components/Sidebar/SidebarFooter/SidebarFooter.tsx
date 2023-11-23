import { useStyles } from './SidebarFooter.styles';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useUserDataEffects } from '@ddhub-client-gateway-frontend/ui/login';

function SidebarFooter() {
  const { classes } = useStyles();
  const { version } = useUserDataEffects();

  return (
    <div className={classes.footerDiv}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <Typography variant="body2" className={classes.label}>
            Powered by
          </Typography>
          <Box className={classes.logoWrapper}>
            <img
              src="/ew-logo-main.svg"
              alt="bottom logo"
              className={classes.logo}
            />
          </Box>
        </Box>
        {version && (
          <Box display="flex" justifyContent="center">
            <Typography variant="body2" className={classes.version}>
              Version {version}
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default SidebarFooter;
