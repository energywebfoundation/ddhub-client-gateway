import { FC } from 'react';
import { Skeleton, Stack, Typography } from '@mui/material';
import { SettingsItem } from '../../components';
import { useGatewayIdentityEffects } from '../GatewayIdentity/GatewayIdentity.effects';
import { Badge, RolesRefresh } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';

export const IdentityRoles: FC = () => {
  const { theme } = useStyles();
  const { isLoading, roles, accountStatus } = useGatewayIdentityEffects();

  // Set empty array to render correctly on loading
  const loadingRoles = isLoading
    ? [
        { namespace: '', status: '' },
        { namespace: '', status: '' },
      ]
    : roles;

  return (
    <SettingsItem
      title="Identity roles"
      icon={RolesRefresh()}
      content={
        <Stack spacing={1}>
          {loadingRoles.map((role, index) => (
            <Stack spacing={1} key={index}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">ROLE</Typography>
                <Typography
                  variant="body2"
                  style={{ color: theme.palette.primary.main }}
                >
                  {isLoading ? (
                    <Skeleton variant="text" width={100} />
                  ) : (
                    role.namespace.split('.')[0]
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Stack spacing={0.5}>
                  <Typography variant="body2">STATUS</Typography>
                  {isLoading ? (
                    <Skeleton variant="text" width={50} />
                  ) : (
                    <Badge text={role.status} />
                  )}
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="body2">DID DOCUMENT</Typography>
                  {isLoading ? (
                    <Skeleton variant="text" width={50} />
                  ) : (
                    <Badge text={accountStatus} />
                  )}
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      }
    />
  );
};
