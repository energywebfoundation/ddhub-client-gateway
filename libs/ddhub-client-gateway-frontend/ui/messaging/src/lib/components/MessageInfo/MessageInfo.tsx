import { FC } from 'react';
import { CardContent, Paper, Typography, Box, Divider } from '@mui/material';
import { useStyles } from './MessageInfo.styles';
import {
  GetReceivedMessageResponseDto,
  GetSentMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { DateTime } from 'luxon';

interface MessageInfoProps {
  messageInfo: GetSentMessageResponseDto | GetReceivedMessageResponseDto;
}

export const MessageInfo: FC<MessageInfoProps> = ({
  messageInfo,
}: MessageInfoProps) => {
  const { classes } = useStyles();
  const recipients =
    (messageInfo as GetSentMessageResponseDto)?.recipients ?? [];
  const messageId = recipients.length
    ? (messageInfo as GetSentMessageResponseDto).clientGatewayMessageId
    : (messageInfo as GetReceivedMessageResponseDto).id;

  return (
    <Paper className={classes.root}>
      <CardContent className={classes.card}>
        <Typography className={classes.heading}>
          {recipients.length
            ? 'Sent Message Details'
            : 'Received Message Details'}
        </Typography>
        <Divider className={classes.divider} />
        {messageInfo && (
          <>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Date & Time
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {DateTime.fromISO(messageInfo.timestampISO).toFormat(
                    'yyyy/MM/dd h:mm:ss a'
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
            {recipients.length ? (
              <Box className={classes.row}>
                <Typography className={classes.title} variant="h4">
                  To
                </Typography>
                <Box>
                  {recipients.map((recipient: any, index: number) => {
                    const hasAlias =
                      !!recipient.alias &&
                      !recipient.alias.startsWith('did:ethr');
                    return (
                      <Typography
                        key={`recipient-${index}`}
                        className={`${classes.subTitle} ${classes.monospace}`}
                      >
                        {hasAlias
                          ? recipient.alias
                          : didFormatMinifier(recipient.did)}
                      </Typography>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Box className={classes.row}>
                <Typography className={classes.title} variant="h4">
                  From
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography className={classes.subTitle} noWrap>
                    {(messageInfo as GetReceivedMessageResponseDto).senderAlias}
                  </Typography>
                </Box>
              </Box>
            )}
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Message ID
              </Typography>
              <Typography className={classes.subTitle} noWrap>
                {recipients.length ? didFormatMinifier(messageId) : messageId}
              </Typography>
            </Box>
            {messageInfo.transactionId && (
              <Box className={classes.row}>
                <Typography className={classes.title} variant="h4">
                  Transaction ID
                </Typography>
                <Typography className={classes.subTitle} noWrap>
                  {messageInfo.transactionId}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Paper>
  );
};
