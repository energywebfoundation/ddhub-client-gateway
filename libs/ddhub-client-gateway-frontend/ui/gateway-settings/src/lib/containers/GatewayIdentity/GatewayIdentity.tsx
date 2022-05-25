import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { SettingsItem, Badge } from '../../components';
import { useGatewayIdentityEffects } from './GatewayIdentity.effects';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';

export const GatewayIdentity: FC = () => {
  const { classes, theme } = useStyles();
  const { update } = useGatewayIdentityEffects();
  return (
    <SettingsItem
      title="Gateway identity"
      icon="/icons/gateway-identity.svg"
      buttonText="Update"
      onClick={update}
      content={
        <>
          <Box display="flex" mt={1.6} mb={0.7}>
            <Typography variant="body2" className={classes.label}>
              ID
            </Typography>
            <Typography variant="body2" className={classes.value}>
              0x133CEF1178BC392a1bFe067595E3846B96097818
            </Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body2" className={classes.label}>
              Namespace
            </Typography>
            <Typography
              variant="body2"
              style={{ color: theme.palette.primary.main }}
              className={classes.value}
            >
              user.roles.ddhub.app.aemo.iam.ewc
            </Typography>
          </Box>
        </>
      }
      footer={
        <Grid container>
          <Grid item xs={5}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" className={classes.label}>
                STATUS
              </Typography>
              <Badge text="Enrolment Complete" />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" className={classes.label}>
              DID DOCUMENT
            </Typography>
            <Badge text="Synced" />
          </Grid>
        </Grid>
      }
    />
  );
};
