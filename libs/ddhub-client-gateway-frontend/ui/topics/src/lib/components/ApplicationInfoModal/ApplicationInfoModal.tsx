import { FC } from 'react';
import { useStyles } from './ApplicationInfoModal.styles';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Box, Stack, Typography } from '@mui/material';
import { Image } from '@ddhub-client-gateway-frontend/ui/core';

interface ApplicationInfoModalProps {
  application: ApplicationDTO;
}

export const ApplicationInfoModal: FC<ApplicationInfoModalProps> = ({
  application,
}: ApplicationInfoModalProps) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.appWrapper}>
      <Image src={application.logoUrl} className={classes.appImage} />
      <Typography className={classes.appName}>{application.appName}</Typography>
      <Stack direction="column">
        <Typography className={classes.label} variant="body2">
          Namespace
        </Typography>
        <Box display="flex">
          <Typography className={classes.namespace} variant="body2" noWrap>
            {application.namespace}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
