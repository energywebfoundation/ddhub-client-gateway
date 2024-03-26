import {
  Card,
  Avatar,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from '@mui/material';
import { Mail } from 'react-feather';
import { Badge } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './BrokerCard.styles';
import getConfig from 'next/config';
import { useContext } from 'react';
import { UserContext } from '@ddhub-client-gateway-frontend/ui/login';

export function BrokerCard() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('[BrokerCard] UserContext provider not available');
  }

  const { classes } = useStyles();
  const { mtlsIsValid } = userContext;
  const { publicRuntimeConfig } = getConfig();
  const defaultMbName = 'DDHub Message Broker';
  const mbName = publicRuntimeConfig?.customMessageBrokerName ?? defaultMbName;

  return (
    <Card className={classes.card}>
      <Box>
        <CardHeader
          title={mbName}
          avatar={
            <Avatar className={classes.avatar}>
              <Mail size={24} className={classes.mailIcon} />
            </Avatar>
          }
          classes={{
            title: classes.title,
          }}
        />
        <CardContent style={{ padding: '28px 16px 0' }}>
          <Box display="flex">
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" className={classes.label}>
                STATUS
              </Typography>
              <Badge text="Online" />
            </Box>
            {mtlsIsValid !== undefined && (
              <Box ml={2} display="flex" flexDirection="column">
                <Typography variant="body2" className={classes.label}>
                  mTLS STATUS
                </Typography>
                <Badge
                  text={mtlsIsValid ? 'Valid' : 'Invalid'}
                  variant={mtlsIsValid ? 'success' : 'error'}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

export default BrokerCard;
