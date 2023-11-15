import { Box, Chip, Typography } from '@mui/material';
import {
  RelatedMessage,
  RelatedMessageProps,
} from '../containers/MessageOutbox';
import { DateTime } from 'luxon';
import { Plus } from 'react-feather';

export const CHANNEL_OUTBOX_HEADERS = [
  {
    Header: 'DATE & TIME',
    accessor: 'timestampNanos',
    Cell: (props: any) => {
      return DateTime.fromISO(props?.value).toLocaleString(
        DateTime.DATETIME_MED
      );
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
      const aliases = recipients.filter((recipient: any) => !!recipient.alias);
      const hasAliases = aliases.length > 0;

      if (hasAliases) {
        const aliasesToRender = aliases.slice(0, 3);
        return (
          <Box>
            <Box mr={1}>
              {aliasesToRender.map((recipient: any, index: number) => {
                let cellText = recipient.alias;

                if (index !== aliasesToRender.length - 1) {
                  cellText += ', ';
                }

                return cellText;
              })}
            </Box>

            {recipients.length > aliasesToRender.length && (
              <Chip
                label={
                  <Typography fontWeight="600" variant="body2">
                    +&nbsp;
                    {recipients.length - aliasesToRender.length}
                  </Typography>
                }
              />
            )}
          </Box>
        );
      } else {
        return `${recipients.length} recipients`;
        //   return props?.value.map((recipient: any, index: number) => {
        //     let cellText = recipient.did;

        //     if (index !== props.value.length - 1) {
        //       cellText += ', ';
        //     }

        //     return cellText;
        //   });
      }
    },
  },
  {
    Header: 'MESSAGE ID',
    accessor: 'clientGatewayMessageId',
    isSortable: true,
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
      return <RelatedMessage value={value} />;
    },
  },
];
