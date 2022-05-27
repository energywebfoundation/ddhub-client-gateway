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

export function BrokerCard() {
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
        <CardContent style={{ padding: '28px 16px 0' }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="body2" className={classes.label}>
              STATUS
            </Typography>
            <Badge text="Online" />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

export default BrokerCard;
