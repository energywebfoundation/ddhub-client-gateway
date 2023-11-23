import { Box, Chip, Typography } from '@mui/material';
import {
  RelatedMessage,
  RelatedMessageProps,
} from '../containers/MessageOutbox';
import { DateTime } from 'luxon';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

export const CHANNEL_OUTBOX_HEADERS = [
  {
    Header: 'DATE & TIME',
    accessor: 'timestampISO',
    Cell: (props: any) => {
      if (!props.value) return '';
      return DateTime.fromISO(props.value).toFormat('yyyy/MM/dd h:mm:ss a');
    },
  },
  {
    Header: 'TOPIC',
    accessor: 'topicName',
    isSortable: true,
  },
  {
    Header: 'SCHEMA VERSION',
    accessor: 'topicVersion',
    isSortable: true,
  },
  {
    Header: 'TO',
    accessor: 'recipients',
    Cell: (props: any) => {
      if (!props?.value) return '';
      const recipients = props?.value.filter(
        (recipient: any) => !recipient.failed
      );
      if (!recipients.length) return 'No successful recipients.';
      const aliases = recipients.filter((recipient: any) => !!recipient.alias);
      const hasAliases = aliases.length > 0;

      if (hasAliases) {
        const aliasesToRender = aliases.slice(0, 3);
        return (
          <Box>
            <Box mr={1}>
              {aliasesToRender[0].alias}
              {recipients.length > 1 && (
                <Chip
                  sx={{ ml: 1 }}
                  label={
                    <Typography fontWeight="600" variant="body2">
                      +&nbsp;
                      {recipients.length - 1}
                    </Typography>
                  }
                />
              )}
            </Box>
          </Box>
        );
      } else {
        return (
          <Box>
            <Box mr={1}>
              {didFormatMinifier(recipients[0].did)}
              {recipients.length > 1 && (
                <Chip
                  sx={{ ml: 1 }}
                  label={
                    <Typography fontWeight="600" variant="body2">
                      +&nbsp;
                      {recipients.length - 1}
                    </Typography>
                  }
                />
              )}
            </Box>
          </Box>
        );
      }
    },
  },
  {
    Header: 'TRANSACTION ID',
    accessor: 'transactionId',
    isSortable: true,
  },
  {
    Header: 'RELATED MESSAGES',
    color: 'primary',
    accessor: 'relatedMessageItems',
    isSortable: true,
    Cell: ({ value }: RelatedMessageProps) => {
      if (!value.messageId) {
        return value.relatedMessagesCount;
      }
      return <RelatedMessage value={value} />;
    },
  },
];
