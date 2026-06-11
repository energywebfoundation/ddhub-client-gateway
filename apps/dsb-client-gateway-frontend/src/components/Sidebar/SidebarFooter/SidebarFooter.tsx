import { useStyles } from './SidebarFooter.styles';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useUserDataEffects } from '@ddhub-client-gateway-frontend/ui/login';
import { publicConfig } from '@ddhub-client-gateway-frontend/ui/utils';

function SidebarFooter() {
  const { classes } = useStyles();
  const { version } = useUserDataEffects();

  const defaultLogoPath = '/ew-main-logo.svg';
  const brandingLogoPath = publicConfig.customBranding ?? defaultLogoPath;
  const isCustomBranding = brandingLogoPath !== defaultLogoPath;

  return (
    <div className={classes.footerDiv}>
      <Box display="flex" flexDirection="column">
        {!isCustomBranding && (
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
        )}
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
