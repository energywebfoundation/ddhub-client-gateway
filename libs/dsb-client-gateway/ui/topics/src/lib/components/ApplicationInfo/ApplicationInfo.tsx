import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useStyles } from './ApplicationInfo.styles';

interface ApplicationInfoProps {
  application: ApplicationDTO;
}

export const ApplicationInfo: FC<ApplicationInfoProps> = ({ application }) => {
  const { classes } = useStyles();
  return (
    <Box>
      <img
        className={classes.appImage}
        src={application.logoUrl}
        alt="app icon"
      />
      <Box mt={2.5}>
        <Typography variant="body2" className={classes.label}>
          Application name
        </Typography>
        <Typography variant="body2" className={classes.value}>
          {application.appName}
        </Typography>
      </Box>
      <Box mt={2.5}>
        <Typography variant="body2" className={classes.label}>
          Namespace
        </Typography>
        <Typography variant="body2" className={classes.value}>
          {application.namespace}
        </Typography>
      </Box>
    </Box>
  );
};
