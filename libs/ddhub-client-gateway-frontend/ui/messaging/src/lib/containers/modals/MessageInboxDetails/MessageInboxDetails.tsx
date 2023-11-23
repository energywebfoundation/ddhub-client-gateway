import { FC, useEffect, useState } from 'react';
import {
  DialogContent,
  Typography,
  Box,
  Grid,
  Stack,
  styled,
  DialogActions,
  Button,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  EditorView,
  ReceivedIcon,
  SentIcon,
  Tabs,
  TabsProps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useMessageInboxDetailsEffects } from './MessageInboxDetails.effects';
import { useStyles } from './MessageInboxDetails.styles';
import { MessageDetail } from './MessageDetail';
import { DateTime } from 'luxon';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ChevronRight } from 'react-feather';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  border: 'none',
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ChevronRight size={'0.9rem'} />}
    {...props}
  />
))(({ theme }) => ({
  padding: '0px 12px',
  minHeight: 'unset',
  height: 36,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.common.white,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  border: 'none',
}));

export const MessageInboxDetails: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    closeModal,
    ackMessage,
    openReplyModal,
    inboxDetails,
    parsedPayload,
    parsedDetails,
  } = useMessageInboxDetailsEffects();
  const [expanded, setExpanded] = useState<number | false>(false);

  useEffect(() => {
    if (inboxDetails && !inboxDetails.isSender) {
      ackMessage([inboxDetails.messageId]);
    }
    setExpanded(0);
  }, [inboxDetails]);

  const handleAccordionChange =
    (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? index : false);
    };

  const tabProps: TabsProps[] = [
    {
      label: 'Entry View',
      childrenProp: (
        <Box className={classes.entryBox}>
          {parsedDetails.map((items, idx) => (
            <Accordion
              key={idx}
              expanded={expanded === idx}
              onChange={handleAccordionChange(idx)}
            >
              <AccordionSummary>
                <Typography
                  variant="body2"
                  fontSize={12}
                  fontFamily="Bw Gradual"
                >
                  Entry {idx + 1}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {items.map((item: any, index: number) => (
                  <MessageDetail key={index} field={item} />
                ))}
              </AccordionDetails>
            </Accordion>
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
                {!inboxDetails.isSender ? (
                  <>
                    <Box width={31} height={31} mb="12px">
                      <ReceivedIcon />
                    </Box>
                    <Typography className={classes.title}>Received</Typography>
                  </>
                ) : (
                  <>
                    <Box width={31} height={31} mb="12px">
                      <SentIcon />
                    </Box>
                    <Typography className={classes.title}>Sent</Typography>
                  </>
                )}

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
                        label: inboxDetails.isSender
                          ? 'Client GW Message ID'
                          : 'Message ID',
                        value:
                          inboxDetails.messageId.length > 24
                            ? didFormatMinifier(inboxDetails.messageId)
                            : inboxDetails.messageId,
                        copyValue: inboxDetails.messageId,
                        copy: true,
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
                  tabWrapperProps={{
                    className: classes.tabHeaderWrapper,
                  }}
                  wrapperProps={{
                    className: classes.tabContentWrapper,
                  }}
                />
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
        {!inboxDetails?.isSender && (
          <Button
            onClick={() => {
              closeModal();
              openReplyModal();
            }}
          >
            Reply
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
