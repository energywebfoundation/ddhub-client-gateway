import {
  Autocomplete,
  CreateButton,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useRoleListEffects } from './RoleList.effects';
import { ROLES_HEADERS } from '../../models';
import { Box, Typography } from '@mui/material';
import { RoleStatus } from './RoleList.types';

export function RoleList() {
  const {
    roles,
    onCreateHandler,
    isLoading,
    statusFilter,
    handleChangeStatusFilter,
  } = useRoleListEffects();

  return (
    <div>
      <GenericTable
        headers={ROLES_HEADERS}
        tableRows={roles}
        actions={null}
        loading={isLoading}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          width="100%"
        >
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            paddingBottom={2}
            marginLeft={4}
          >
            <Typography variant="body2" color="grey.600">
              Status
            </Typography>
            <Autocomplete
              options={[
                RoleStatus.pending,
                RoleStatus.requested,
                RoleStatus.rejected,
                'All',
              ]}
              value={'All'}
              onChange={(_, value) => {
                handleChangeStatusFilter(value);
              }}
            />
          </Box>
          <CreateButton onCreate={onCreateHandler} buttonText="Request Role" />
        </Box>
      </GenericTable>
    </div>
  );
}
