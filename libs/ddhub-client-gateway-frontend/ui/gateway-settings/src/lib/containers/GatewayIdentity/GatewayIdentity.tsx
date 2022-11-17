import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { SettingsItem } from '../../components';
import { useGatewayIdentityEffects } from './GatewayIdentity.effects';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';

export const GatewayIdentity: FC = () => {
  const { classes, theme } = useStyles();
  const { update, identity, namespace, openRolesModal } = useGatewayIdentityEffects();
  return (
    <SettingsItem
      title="Gateway identity"
      icon="/icons/gateway-identity.svg"
      buttonText="Update"
      secondaryButtonText="Roles"
      onClick={update}
      onClickSecondary={openRolesModal}
      content={
        <>
          <Box display="flex" mt={1.6} mb={0.7}>
            <Typography variant="body2" className={classes.label}>
              ID
            </Typography>
            <Typography variant="body2" className={classes.value}>
              {didFormatMinifier(identity?.enrolment?.did)}
            </Typography>
            <CopyToClipboard text={identity?.enrolment?.did} />
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
