import { FC } from 'react';
import { CardContent, Paper, Typography, Box } from '@mui/material';
import { useStyles } from './MessageInfo.styles';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { DateTime } from 'luxon';

interface MessageInfoProps {
  messageInfo: GetSentMessageResponseDto;
}

export const MessageInfo: FC<MessageInfoProps> = ({
  messageInfo,
}: MessageInfoProps) => {
  const { classes } = useStyles();

  return (
    <Paper className={classes.root}>
      <CardContent className={classes.card}>
        {messageInfo && (
          <>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Date & Time
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {DateTime.fromISO(messageInfo.timestampISO).toFormat(
                    'yyyy/MM/dd h:mm:ss a',
                  )}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Topic
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {messageInfo.topicName}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Schema version
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {messageInfo.topicVersion}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                To
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography
                  className={`${classes.subTitle} ${classes.monospace}`}
                >
                  {messageInfo.recipients?.map(
                    (recipient: any, index: number) =>
                      `${didFormatMinifier(recipient.did)}\n`,
                  )}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Related Message ID
              </Typography>
              <Typography className={classes.subTitle} noWrap>
                {messageInfo.initiatingMessageId}
              </Typography>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Related Transaction ID
              </Typography>
              <Typography className={classes.subTitle} noWrap>
                {messageInfo.initiatingTransactionId}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Paper>
  );
};
