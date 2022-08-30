import { FC } from 'react';
import clsx from 'clsx';
import { CardContent, Paper, Typography, Box } from '@mui/material';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useStyles } from './ChannelInfo.styles';
import { ChannelConnectionType } from '../../models/channel-connection-type.enum';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

interface ChannelInfoProps {
  channel: GetChannelResponseDto;
  topicName?: string;
}

export const ChannelInfo: FC<ChannelInfoProps> = ({ channel, topicName }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.root}>
      <CardContent className={classes.card}>
        {topicName && (
          <Box
            className={clsx(classes.cardHeader, {
              [classes.cardHeaderWithBorder]: topicName,
            })}
          >
            <Typography className={classes.title} variant="body2">
              Topic
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography className={classes.subTitle} noWrap>
                {topicName}
              </Typography>
            </Box>
          </Box>
        )}
        <Box
          className={clsx(classes.cardHeader, {
            [classes.cardHeaderWithBorder]: !topicName,
          })}
        >
          <Typography className={classes.title} variant="body2">
            Channel
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              className={clsx(classes.subTitle, {
                [classes.primary]: topicName,
              })}
              noWrap
            >
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
          <Box sx={{ marginBottom: '10px', marginTop: '1px' }}>
            <Typography className={classes.subTitle} variant="body2">
              Roles
            </Typography>
            {
              !channel.conditions?.roles?.length && (
                <Typography className={classes.subTitle} variant="body2">
                  -
                </Typography>
              )
            }
            {channel.conditions?.roles?.map((role) => (
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
          <Box sx={{ marginBottom: '10px' }}>
            <Typography className={classes.subTitle} variant="body2">
              DIDs
            </Typography>
            {
              !channel.conditions?.dids?.length && (
                <Typography className={classes.subTitle} variant="body2">
                  -
                </Typography>
              )
            }
            {channel.conditions?.dids?.map((did) => (
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
