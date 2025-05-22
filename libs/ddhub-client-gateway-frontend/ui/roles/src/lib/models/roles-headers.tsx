import {
  TableHeader,
  CopyToClipboard,
} from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Chip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { alpha, Theme } from '@mui/material/styles';
import {
  ExpirationStatus,
  RoleStatus,
} from '../components/RoleList/RoleList.types';

const getChipStyles = (status: RoleStatus, theme: Theme) => {
  if (status === RoleStatus.active || status === RoleStatus.synced) {
    return {
      backgroundColor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.main,
    };
  }
  if (status === RoleStatus.pending || status === RoleStatus.requested) {
    return {
      backgroundColor: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.warning.main,
    };
  }
  if (status === RoleStatus.rejected) {
    return {
      backgroundColor: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.main,
    };
  }
};

export const ROLES_HEADERS: TableHeader[] = [
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
    accessor: 'role',
    isSortable: true,
  },
  {
    Header: 'PARENT NAMESPACE',
    accessor: 'namespace',
    Cell: ({ value }: { value: string }) => (
      <Box display="flex" alignItems="center">
        <Typography variant="body2">{value}</Typography>
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
            ...getChipStyles(value as RoleStatus, theme),
          })}
        />
      );
    },
  },
  {
    Header: 'EXPIRATION STATUS',
    accessor: 'expirationStatus',
    Cell: ({ value }: { value: string }) => {
      if (value === ExpirationStatus.expired) {
        return (
          <Chip
            label={value}
            sx={(theme) => ({
              borderRadius: '5px',
              padding: '1px 2px',
              height: '20px',
              fontSize: '12px',
              fontWeight: 405,
              backgroundColor: alpha(theme.palette.error.main, 0.12),
              color: theme.palette.error.main,
            })}
          />
        );
      }
      return <Typography variant="body2">-</Typography>;
    },
  },
  {
    Header: 'EXPIRATION DATE',
    accessor: 'expirationDate',
    Cell: ({ value }: { value: string }) => {
      const date = DateTime.fromISO(value).toFormat('yyyy-MM-dd');

      return (
        <Box display="flex" alignItems="flex-start" flexDirection="column">
          <Typography variant="body2">{date}</Typography>
        </Box>
      );
    },
  },
];
