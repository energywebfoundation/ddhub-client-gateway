import { TableHeader } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Typography } from '@mui/material';

export const USERS_HEADERS: TableHeader[] = [
  {
    Header: 'USERNAME',
    accessor: 'username',
    Cell: ({ value }: { value: string }) => {
      return (
        <Box display="flex" alignItems="flex-start" flexDirection="column">
          <Typography variant="body2">{value}</Typography>
        </Box>
      );
    },
    isSortable: true,
  },
  {
    Header: 'ROLE',
    accessor: 'role',
    isSortable: true,
  },
];
