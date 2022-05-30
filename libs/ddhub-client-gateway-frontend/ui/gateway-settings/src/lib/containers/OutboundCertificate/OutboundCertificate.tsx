import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { SettingsItem } from '../../components';
import { useOutboundCertificateEffects } from './OutboundCertificate.effects';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';

export const OutboundCertificate: FC = () => {
  const { classes } = useStyles();
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
    />
  );
};
