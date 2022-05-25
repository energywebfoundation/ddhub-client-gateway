import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { SettingsItem } from '../../components';
import { useGatewayIdentityEffects } from './GatewayIdentity.effects';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';

export const GatewayIdentity: FC = () => {
  const { classes, theme } = useStyles();
  const { update, identity, namespace } = useGatewayIdentityEffects();
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
              {identity?.enrolment?.did}
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
              {namespace}
            </Typography>
          </Box>
        </>
      }
    />
  );
};
