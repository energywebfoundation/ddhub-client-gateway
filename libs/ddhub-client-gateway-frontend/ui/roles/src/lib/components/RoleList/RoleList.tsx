import {
  Autocomplete,
  CreateButton,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useRoleListEffects } from './RoleList.effects';
import { ROLES_HEADERS, RoleStatusLabel } from '../../models';
import { Box, Typography } from '@mui/material';
import { Banner } from '../Banner/Banner';
import { RequesterClaimDTOStatus } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RolesCountdown } from '../RolesCountdown/RolesCountdown';

const statusOptions: RoleStatusLabel[] = [
  RoleStatusLabel.approved,
  RoleStatusLabel.pending,
  RoleStatusLabel.requested,
  RoleStatusLabel.rejected,
  RoleStatusLabel.synced,
];

const statusOptionsWithAll = [...statusOptions, 'All'];

export function RoleList() {
  const {
    roles,
    onCreateHandler,
    isLoading,
    handleChangeStatusFilter,
    refetch,
    actions,
    hasPendingRequests,
    statusFilter,
  } = useRoleListEffects();

  return (
    <div>
      <GenericTable
        headers={ROLES_HEADERS}
        tableRows={roles}
        actions={(row) => {
          if (row.status === RequesterClaimDTOStatus.AWAITING_APPROVAL) {
            return actions;
          }
          return undefined;
        }}
        loading={isLoading}
        renderBanner={() =>
          hasPendingRequests ? (
            <Banner text="The screen will refresh every 60 seconds if any roles require approval" />
          ) : null
        }
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
              wrapperProps={{ width: 150 }}
              options={statusOptionsWithAll}
              value={statusFilter}
              onChange={(_, value) => {
                if (value) {
                  return handleChangeStatusFilter(value);
                }
                return handleChangeStatusFilter('All');
              }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="baseline"
            gap={2}
          >
            {hasPendingRequests && <RolesCountdown refetch={refetch} />}

            <CreateButton
              onCreate={onCreateHandler}
              buttonText="Request Role"
            />
          </Box>
        </Box>
      </GenericTable>
    </div>
  );
}
