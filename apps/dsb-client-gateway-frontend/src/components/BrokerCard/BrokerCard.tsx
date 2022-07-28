import {
  Card,
  Avatar,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Skeleton,
  Stack,
} from '@mui/material';
import { Mail } from 'react-feather';
import { Badge, BadgeText } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './BrokerCard.styles';
import { useGatewayIdentityEffects } from 'libs/ddhub-client-gateway-frontend/ui/gateway-settings/src/lib/containers/GatewayIdentity/GatewayIdentity.effects';

export function BrokerCard() {
  const { messageBrokerStatus, isLoading } = useGatewayIdentityEffects();
  const { classes } = useStyles();

  return (
    <Card className={classes.card}>
      <Box>
        <CardHeader
          title={'DDHub message broker'}
          avatar={
            <Avatar className={classes.avatar}>
              <Mail size={24} className={classes.mailIcon} />
            </Avatar>
          }
          classes={{
            title: classes.title,
          }}
        />
        <CardContent style={{ padding: '16px' }}>
          <Stack spacing={1}>
            <Typography variant="body2" className={classes.label}>
              STATUS
            </Typography>
            {isLoading ? (
              <Box>
                <Skeleton variant="text" width={100} height={20} />
              </Box>
            ) : messageBrokerStatus === 'OK' ? (
              <Badge text={BadgeText.ONLINE} />
            ) : (
              <Badge text={BadgeText.ONLINE} />
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}

export default BrokerCard;
