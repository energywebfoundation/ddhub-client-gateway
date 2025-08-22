import dayjs from 'dayjs';
import {
  TableHeader,
  CopyToClipboard,
} from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Chip, Typography } from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';

export enum ApiKeyStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
}

const getChipStyles = (status: ApiKeyStatus, theme: Theme) => {
  if (status === ApiKeyStatus.ACTIVE) {
    return {
      backgroundColor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.main,
    };
  }

  return {
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    color: theme.palette.error.main,
  };
};

export const API_KEYS_HEADERS: TableHeader[] = [
  {
    Header: 'LABEL',
    accessor: 'name',
    isSortable: true,
  },
  {
    Header: 'API KEY',
    accessor: 'apiKey',
    isSortable: true,
    Cell: ({ value }: { value: string }) => (
      <Box display="flex" alignItems="center">
        <Typography variant="body2">{value}</Typography>
        <CopyToClipboard text={value} />
      </Box>
    ),
  },
  {
    Header: 'EXPIRY DATE',
    accessor: 'expiresAt',
    isSortable: true,
    Cell: (props: any) => {
      return dayjs(props.value).format('DD/MM/YYYY');
    },
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    isSortable: true,
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
            ...getChipStyles(value as ApiKeyStatus, theme),
          })}
        />
      );
    },
  },
];
