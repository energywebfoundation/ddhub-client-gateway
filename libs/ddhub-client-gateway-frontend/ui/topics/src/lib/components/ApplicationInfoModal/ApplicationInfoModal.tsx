import { FC } from 'react';
import { useStyles } from './ApplicationInfoModal.styles';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Box, Typography } from '@mui/material';
import { Image } from '@ddhub-client-gateway-frontend/ui/core';

interface ApplicationInfoModalProps {
  application: ApplicationDTO;
}

export const ApplicationInfoModal: FC<ApplicationInfoModalProps> = ({
                                          application
                                        }: ApplicationInfoModalProps) => {
  const {classes} = useStyles();

  return (
    <Box className={classes.appWrapper}>
      <Image src={application.logoUrl} className={classes.appImage} />
      <Typography className={classes.appName}>
        {application.appName}
      </Typography>
      <Typography className={classes.namespace}>
        {application.namespace}
      </Typography>
    </Box>
  );
}
