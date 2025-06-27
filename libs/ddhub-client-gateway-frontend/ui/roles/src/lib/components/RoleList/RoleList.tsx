import {
  Autocomplete,
  CreateButton,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useRoleListEffects } from './RoleList.effects';
import { ROLES_HEADERS, RoleStatus } from '../../models';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Banner } from '../Banner/Banner';

const statusOptions: RoleStatus[] = [
  RoleStatus.approved,
  RoleStatus.pending,
  RoleStatus.requested,
  RoleStatus.rejected,
  RoleStatus.synced,
];

export function RoleList() {
  const {
    roles,
    onCreateHandler,
    isLoading,
    handleChangeStatusFilter,
    countdown,
    lastUpdateTime,
    actions,
    hasPendingRequests,
  } = useRoleListEffects();

  return (
    <div>
      <GenericTable
        headers={ROLES_HEADERS}
        tableRows={roles}
        actions={(row) => {
          if (row.status === 'AWAITING_APPROVAL') {
            return actions;
          }
          return undefined;
        }}
        loading={isLoading}
        renderBanner={() =>
          hasPendingRequests ? (
            <Banner text="The screen will efresh every 10 seconds if a status requires transaction approval" />
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
              options={[...statusOptions, 'All']}
              value={'All'}
              onChange={(_, value) => {
                handleChangeStatusFilter(value);
              }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="baseline"
            gap={2}
          >
            {hasPendingRequests && (
              <>
                <CircularProgress size={16} color="primary" />
                <Typography variant="body2" color="text.primary">
                  Next refresh in {countdown} seconds. Updated: {lastUpdateTime}
                </Typography>
              </>
            )}

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
