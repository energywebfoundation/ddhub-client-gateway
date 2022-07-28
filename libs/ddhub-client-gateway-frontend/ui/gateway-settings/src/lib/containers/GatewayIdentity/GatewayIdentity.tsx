import { FC } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { SettingsItem } from '../../components';
import { useGatewayIdentityEffects } from './GatewayIdentity.effects';
import { useStyles } from '../../components/SettingsItem/SettingsItem.styles';

export const GatewayIdentity: FC = () => {
  const { theme } = useStyles();
  const { update, namespace, did, isLoading } = useGatewayIdentityEffects();

  return (
    <SettingsItem
      title="Gateway identity"
      icon="/icons/gateway-identity.svg"
      buttonText="Update identity"
      onClick={update}
      content={
        <Box>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">DID</Typography>
            <Typography variant="body2">
              {isLoading ? <Skeleton variant="text" width={100} /> : did}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">NAMESPACE</Typography>
            <Typography
              variant="body2"
              style={{ color: theme.palette.primary.main }}
            >
              {isLoading ? <Skeleton variant="text" width={100} /> : namespace}
            </Typography>
          </Stack>
        </Box>
      }
    />
  );
};
