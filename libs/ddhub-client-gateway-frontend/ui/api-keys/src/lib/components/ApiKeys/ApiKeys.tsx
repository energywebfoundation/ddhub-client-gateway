import { useApiKeysEffects } from './ApiKeys.effects';
import {
  CreateButton,
  GenericTable,
  Autocomplete
} from '@ddhub-client-gateway-frontend/ui/core';
import { ApiKeyResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { API_KEYS_HEADERS, ApiKeyStatus } from '../../models/api-keys-headers';
import { Box, Typography } from '@mui/material';

export interface ApiKeyResponseDtoWithStatus extends ApiKeyResponseDto {
  status: string;
}

const statusOptions: ApiKeyStatus[] = [
  ApiKeyStatus.ACTIVE,
  ApiKeyStatus.EXPIRED,
];

const statusOptionsWithAll = [...statusOptions, 'All'];

export const ApiKeysList = () => {
  const { apiKeys, isLoading, handleAddApiKey, actions, handleChangeStatusFilter, statusFilter } = useApiKeysEffects();

  return (
    <div style={{ marginTop: 16 }}>
      <GenericTable
        headers={API_KEYS_HEADERS}
        tableRows={apiKeys}
        loading={isLoading}
        showFooter={true}
        defaultSortBy="label"
        defaultOrder="asc"
        actions={(row) => {
          if (row.status === ApiKeyStatus.ACTIVE) {
            return actions;
          }
          return [actions[1]];
        }}
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
            marginLeft={4}>
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
            <CreateButton onCreate={handleAddApiKey} buttonText="New API Key" />
          </Box>
      </GenericTable>
    </div>
  );
};
