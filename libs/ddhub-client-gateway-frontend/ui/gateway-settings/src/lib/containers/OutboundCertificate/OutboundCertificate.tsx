import { FC } from 'react';
import { Box, Typography, Stack, Skeleton } from '@mui/material';
import { SettingsItem } from '../../components';
import { useOutboundCertificateEffects } from './OutboundCertificate.effects';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';
import { useGatewayIdentityEffects } from '../GatewayIdentity/GatewayIdentity.effects';
import { Badge } from '@ddhub-client-gateway-frontend/ui/core';

export const OutboundCertificate: FC = () => {
  const { classes } = useStyles();
  const { mtlsIsValid, isLoading } = useGatewayIdentityEffects();
  const { openConfigureModal } = useOutboundCertificateEffects();

  return (
    <SettingsItem
      title="Outbound certificate"
      icon="/icons/outbound-certificate.svg"
      buttonText="Configure"
      onClick={openConfigureModal}
      content={
        <Box display="flex" mt={0.5}>
          <Typography variant="body2" className={classes.value}>
            Certificates to enable mTLS connection to the Message Broker
          </Typography>
        </Box>
      }
      footer={
        <Stack direction="row" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="body2">STATUS</Typography>
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Badge text={mtlsIsValid ? 'VALID' : 'INVALID'} />
            )}
          </Stack>
        </Stack>
      }
    />
  );
};
