import {
  TableHeader,
  CopyToClipboard,
} from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { alpha, Theme } from '@mui/material/styles';
import { RoleRequestStatus } from '../components/RoleRequestsList/RoleRequestsList.effects';

const shortenedDID = (did: string) => {
  return did.slice(0, 17) + '...' + did.slice(-4);
};

const getChipStyles = (status: RoleRequestStatus, theme: Theme) => {
  if (
    status === RoleRequestStatus.PENDING ||
    status === RoleRequestStatus.REVOKING ||
    status === RoleRequestStatus.APPROVING ||
    status === RoleRequestStatus.REJECTING
  ) {
    return {
      backgroundColor: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.warning.main,
    };
  }
  if (status === RoleRequestStatus.APPROVED) {
    return {
      backgroundColor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.main,
    };
  }
  if (
    status === RoleRequestStatus.REJECTED ||
    status === RoleRequestStatus.REVOKED
  ) {
    return {
      backgroundColor: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.main,
    };
  }
};

export const ROLES_REQUESTS_HEADERS: TableHeader[] = [
  {
    Header: 'REQUEST DATE ',
    accessor: 'requestDate',
    Cell: ({ value }: { value: string }) => {
      const [date, time] = DateTime.fromISO(value)
        .toFormat('yyyy-MM-dd HH:mm:ss')
        .split(' ');
      return (
        <Box display="flex" alignItems="flex-start" flexDirection="column">
          <Typography variant="body2">{date}</Typography>
          <Typography variant="body2">{time}</Typography>
        </Box>
      );
    },
  },
  {
    Header: 'ROLE',
    accessor: 'fqcn',
    isSortable: true,
  },
  {
    Header: 'PARENT NAMESPACE',
    accessor: 'parentNamespace',
    Cell: ({ value }: { value: string }) => (
      <Typography variant="body2">{value}</Typography>
    ),
  },
  {
    Header: 'REQUESTOR DID',
    accessor: 'requestorDid',
    Cell: ({ value }: { value: string }) => (
      <Box display="flex" alignItems="center">
        <Tooltip title={value}>
          <Typography variant="body2">{shortenedDID(value)}</Typography>
        </Tooltip>
        <CopyToClipboard text={value} />
      </Box>
    ),
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    Cell: ({ value }: { value: string }) => {
      return (
        <Chip
          label={value}
          sx={(theme) => ({
            borderRadius: '5px',
            padding: '1px 2px',
            height: '20px',
            fontSize: '12px',
            fontWeight: 405,
            lineHeight: '18px',
            ...getChipStyles(value as RoleRequestStatus, theme),
          })}
        />
      );
    },
  },
];
