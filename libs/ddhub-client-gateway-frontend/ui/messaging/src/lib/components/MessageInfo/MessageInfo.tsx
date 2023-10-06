import { FC } from 'react';
import { CardContent, Paper, Typography, Box } from '@mui/material';
import { useStyles } from './MessageInfo.styles';
import { GetMessagesResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

interface MessageInfoProps {
  messageInfo: GetMessagesResponseDto;
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
                Date & time
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {messageInfo.relatedMessagesCount}
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
                <Typography className={classes.subTitle} noWrap>
                  {/*todo*/}
                  {messageInfo.sender}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Message ID
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {messageInfo.id}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.row}>
              <Typography className={classes.title} variant="h4">
                Transaction ID
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className={classes.subTitle} noWrap>
                  {messageInfo.transactionId}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Paper>
  );
};
