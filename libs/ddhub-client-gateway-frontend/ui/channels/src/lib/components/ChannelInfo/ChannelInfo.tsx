import { FC } from 'react';
import { CardContent, Paper, Typography, Box } from '@mui/material';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useStyles } from './ChannelInfo.styles';
import { ChannelConnectionType } from '../../models/channel-connection-type.enum';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

interface ChannelInfoProps {
  channel: GetChannelResponseDto;
}

export const ChannelInfo: FC<ChannelInfoProps> = ({ channel }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.root}>
      <CardContent className={classes.card}>
        <Box className={classes.cardHeader}>
          <Typography className={classes.title} variant="body2">
            Channel
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography className={classes.subTitle} noWrap>
              {channel.fqcn}
            </Typography>
          </Box>
        </Box>
        <div className={classes.row}>
          <Typography className={classes.title} variant="h4">
            Type
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography className={classes.subTitle} noWrap>
              {ChannelConnectionType[channel.type]}
            </Typography>
          </Box>
        </div>
        <div>
          <Typography className={classes.title} variant="h4">
            Restrictions
          </Typography>
          <Box sx={{ marginTop: '10px' }}>
            <Typography className={classes.subTitle} variant="body2">
              Roles
            </Typography>
            {channel.conditions?.roles.map((role) => (
              <Typography
                key={role}
                className={classes.subTitle}
                variant="body2"
                noWrap
              >
                {role}
              </Typography>
            ))}
          </Box>
          <Box sx={{ marginTop: '10px' }}>
            <Typography className={classes.subTitle} variant="body2">
              DIDs
            </Typography>
            {channel.conditions?.dids.map((did) => (
              <Typography
                key={did}
                className={classes.subTitle}
                variant="body2"
              >
                {didFormatMinifier(did)}
              </Typography>
            ))}
          </Box>
        </div>
      </CardContent>
    </Paper>
  );
};
