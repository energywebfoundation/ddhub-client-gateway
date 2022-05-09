import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Image } from '@dsb-client-gateway/ui/core';
import { useStyles } from './ApplicationInfo.styles';

interface ApplicationInfoProps {
  application: ApplicationDTO;
}

export const ApplicationInfo: FC<ApplicationInfoProps> = ({ application }) => {
  const { classes } = useStyles();
  return (
    <Box>
      <Image src={application.logoUrl} className={classes.appImage} />
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
