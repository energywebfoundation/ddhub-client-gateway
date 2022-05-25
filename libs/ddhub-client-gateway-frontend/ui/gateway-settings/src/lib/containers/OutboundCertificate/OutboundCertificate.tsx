import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { SettingsItem, Badge } from '../../components';
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
      footer={
        <Grid container>
          <Grid item xs={5}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" className={classes.label}>
                STATUS
              </Typography>
              <Box display="flex" alignItems="center">
                <Badge text="Set" />
                <Typography variant="body2" className={classes.subtitle}>
                  Updated 20mins ago
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      }
    />
  );
};
