import {
  CloseButton,
  Dialog,
  GenericTable,
  SentIcon,
} from '@ddhub-client-gateway-frontend/ui/core';
import { GetSentMessageRecipientsResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  Box,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { useStyles } from './MessageRecipientList.styles';
import { MESSAGE_RECIPIENT_LIST_HEADERS } from '../../../models/message-recipient-list-header';
import { useMessageRecipientListEffects } from './MessageRecipientList.effects';
import { MessageDetail } from '../MessageInboxDetails/MessageDetail';
import { DateTime } from 'luxon';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

export const MessageRecipientList: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, inboxDetails } = useMessageRecipientListEffects();
  return (
    <Dialog paperClassName={classes.paper} open={open} onClose={closeModal}>
      <DialogContent sx={{ padding: 0 }}>
        {inboxDetails && (
          <Grid container className={classes.content} flexDirection={'row'}>
            <Grid item xs={4} paddingRight={4}>
              <Box className={classes.appWrapper}>
                <>
                  <Box width={31} height={31} mb="12px">
                    <SentIcon />
                  </Box>
                  <Typography className={classes.title}>Sent</Typography>
                </>

                <Box display="flex">
                  <Stack direction="column" spacing={2}>
                    <MessageDetail
                      field={{
                        label: 'Timestamp',
                        value: DateTime.fromISO(
                          inboxDetails.timestampISO
                        ).toFormat('yyyy/MM/dd h:mm:ss a'),
                      }}
                    />
                    {inboxDetails.transactionId && (
                      <MessageDetail
                        field={{
                          label: 'Transaction ID',
                          value: inboxDetails.transactionId,
                          copy: true,
                        }}
                      />
                    )}
                    {/* Minify Client GW Message ID as it is quite long */}
                    <MessageDetail
                      field={{
                        label: 'Client GW Message ID',
                        value: didFormatMinifier(
                          inboxDetails.clientGatewayMessageId
                        ),
                        copyValue: inboxDetails.clientGatewayMessageId,
                        copy: true,
                      }}
                    />
                    <MessageDetail
                      field={{
                        label: 'Channel',
                        value: inboxDetails.fqcn,
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
              {inboxDetails?.recipients?.length && (
                <div style={{ flex: 3 }}>
                  <Typography className={classes.title}>
                    Individual Message Recipients
                  </Typography>
                  <GenericTable<GetSentMessageRecipientsResponseDto>
                    headers={MESSAGE_RECIPIENT_LIST_HEADERS}
                    tableRows={inboxDetails.recipients}
                    showSearch={false}
                    defaultSortBy="did"
                    defaultOrder="desc"
                  />
                </div>
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
