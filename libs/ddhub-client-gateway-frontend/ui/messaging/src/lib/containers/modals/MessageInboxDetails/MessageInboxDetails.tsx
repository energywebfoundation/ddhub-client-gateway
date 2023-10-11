import React, { FC } from 'react';
import { DialogContent, Typography, Box, Grid, Stack } from '@mui/material';
import {
  Dialog,
  EditorView,
  ReceivedIcon,
  Tabs,
  TabsProps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useMessageInboxDetailsEffects } from './MessageInboxDetails.effects';
import { useStyles } from './MessageInboxDetails.styles';
import { MessageDetail } from './MessageDetail';
import { MessageEntryView } from './MessageEntryView';

export const MessageInboxDetails: FC = () => {
  const { classes } = useStyles();

  const { open, closeModal, inboxDetails, parsedPayload, parsedDetails } =
    useMessageInboxDetailsEffects();

  const tabProps: TabsProps[] = [
    {
      label: 'Entry View',
      childrenProp: (
        <Box className={classes.entryBox}>
          <MessageDetail
            field={{
              label: 'Channel',
              value: inboxDetails?.channelName,
              isEntryView: true,
            }}
          />
          <MessageDetail
            field={{
              label: 'Topic Name',
              value: inboxDetails?.topicName,
              isEntryView: true,
            }}
          />
          <MessageDetail
            field={{
              label: 'Version',
              value: inboxDetails?.topicVersion,
              isEntryView: true,
            }}
          />
          <MessageDetail
            field={{
              label: 'Transaction ID',
              value: inboxDetails?.transactionId,
              isEntryView: true,
              copy: true,
            }}
          />

          {parsedDetails.map((items, idx) => (
            <MessageEntryView index={idx} items={items} />
          ))}
        </Box>
      ),
    },
    {
      label: 'JSON View',
      childrenProp: <EditorView value={parsedPayload} height={434} />,
    },
  ];

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogContent sx={{ padding: 0 }}>
        {inboxDetails && (
          <Grid container className={classes.content} flexDirection={'row'}>
            <Grid item xs={4} paddingRight={4}>
              <Box className={classes.appWrapper}>
                <Box width={31} height={31} mb="12px">
                  <ReceivedIcon />
                </Box>
                <Typography className={classes.title}>Received</Typography>

                <Box display="flex">
                  <Stack direction="column" spacing={2}>
                    <MessageDetail
                      field={{
                        label: 'Transaction ID',
                        value: inboxDetails.transactionId,
                      }}
                    />
                    <MessageDetail
                      field={{
                        label: 'Message ID',
                        value: inboxDetails.messageId,
                      }}
                    />
                    <MessageDetail
                      field={{
                        label: 'Channel',
                        value: inboxDetails.channelName,
                      }}
                    />
                    <MessageDetail
                      field={{
                        label: 'Topic Name',
                        value: inboxDetails.topicName,
                      }}
                    />
                    <MessageDetail
                      field={{
                        label: 'Version',
                        value: inboxDetails.topicVersion,
                      }}
                    />
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <Grid item className={classes.contentWrapper} xs={8}>
              {inboxDetails && (
                <Tabs
                  tabProps={tabProps}
                  wrapperProps={{
                    className: classes.tabBox,
                  }}
                />
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
