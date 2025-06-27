import {
  Autocomplete,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { ROLES_REQUESTS_HEADERS } from '../../models';
import {
  RoleRequestStatus,
  useRoleRequestsListEffects,
} from './RoleRequestsList.effects';
import { Box, Typography } from '@mui/material';
import { useModalActionsEffects } from './ModalActions.effects';

export function RoleRequestsList() {
  const { roleRequests, statusFilter, handleChangeStatusFilter } =
    useRoleRequestsListEffects();

  const actions = useModalActionsEffects();

  return (
    <div>
      <GenericTable
        headers={ROLES_REQUESTS_HEADERS}
        tableRows={roleRequests}
        actions={actions}
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
              RoleRequestStatus.PENDING,
              RoleRequestStatus.APPROVING,
              RoleRequestStatus.APPROVED,
              RoleRequestStatus.REVOKING,
              RoleRequestStatus.REVOKED,
              RoleRequestStatus.REJECTING,
              RoleRequestStatus.REJECTED,
              'All',
            ]}
            value={'All'}
            onChange={(_, value) => {
              handleChangeStatusFilter(value);
            }}
          />
        </Box>
      </GenericTable>
    </div>
  );
}
