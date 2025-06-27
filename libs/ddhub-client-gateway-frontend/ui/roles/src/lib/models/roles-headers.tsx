import {
  TableHeader,
  CopyToClipboard,
} from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Chip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { alpha, Theme } from '@mui/material/styles';
import { ExpirationStatus } from '../components/RoleList/RoleList.types';
import { RequesterClaimDTOStatus } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export enum RoleStatus {
  approved = 'Approved',
  pending = 'Pending',
  requested = 'Requested',
  rejected = 'Rejected',
  synced = 'Synced',
}

const getChipStyles = (status: RequesterClaimDTOStatus, theme: Theme) => {
  if (status === 'APPROVED' || status === 'SYNCED') {
    return {
      backgroundColor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.main,
    };
  }
  if (status === 'AWAITING_APPROVAL' || status === 'NOT_ENROLLED') {
    return {
      backgroundColor: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.warning.main,
    };
  }
  if (status === 'REJECTED' || status === 'NO_CLAIM') {
    return {
      backgroundColor: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.main,
    };
  }

  throw new Error(`Unknown role status: ${status}`);
};

const mapStatusToLabel = (status: RequesterClaimDTOStatus) => {
  if (status === 'APPROVED') {
    return RoleStatus.approved;
  }
  if (status === 'SYNCED') {
    return RoleStatus.synced;
  }
  if (status === 'AWAITING_APPROVAL') {
    return RoleStatus.pending;
  }

  if (status === 'NOT_ENROLLED') {
    return RoleStatus.requested;
  }

  if (status === 'REJECTED' || status === 'NO_CLAIM') {
    return RoleStatus.rejected;
  }

  throw new Error(`Unknown role status: ${status}`);
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
          label={mapStatusToLabel(value as RequesterClaimDTOStatus)}
          sx={(theme) => ({
            borderRadius: '5px',
            padding: '1px 2px',
            height: '20px',
            fontSize: '12px',
            fontWeight: 405,
            lineHeight: '18px',
            textTransform: 'capitalize',
            ...getChipStyles(value as RequesterClaimDTOStatus, theme),
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
    Cell: ({ value }: { value: string | null }) => {
      if (!value) return <Typography variant="body2">-</Typography>;
      const date = DateTime.fromISO(value).toFormat('yyyy-MM-dd');

      return (
        <Box display="flex" alignItems="flex-start" flexDirection="column">
          <Typography variant="body2">{date}</Typography>
        </Box>
      );
    },
  },
];
