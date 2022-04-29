import { FC } from 'react';
import { CardContent, Paper, Typography, Box } from '@mui/material';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelType } from '../models/type';
import { useStyles } from './ChannelInfo.styles';

interface ChannelInfoProps {
  channel: GetChannelResponseDto;
}

export const ChannelInfo: FC<ChannelInfoProps> = ({ channel }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.root}>
      <CardContent className={classes.card}>
        <Box className={classes.cardHeader}>
          <Typography className={classes.cardHeaderText} variant="body2">
            Messaging
          </Typography>
        </Box>
        <div className={classes.row}>
          <Typography className={classes.title} variant="h4">
            Internal channel
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography className={classes.subTitle} noWrap>
              {channel.fqcn}
            </Typography>
          </Box>
        </div>
        <div>
          <Typography className={classes.title} variant="h4">
            Type
          </Typography>
          <Typography className={classes.subTitle} variant="body2">
            {ChannelType[channel.type]}
          </Typography>
        </div>
      </CardContent>
    </Paper>
  );
};
