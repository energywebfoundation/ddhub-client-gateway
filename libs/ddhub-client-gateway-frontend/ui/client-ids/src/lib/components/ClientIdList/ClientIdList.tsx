import React from 'react';
import { useClientIdsEffects } from './ClientIdList.effects';
import { CreateButton, GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { GetAllClientsResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { CLIENT_IDS_HEADERS } from '../../models/clientids-header';

export const ClientIdList = () => {
  const { clientIds, isLoading, actions, removeClientIds, setSelectedItems } = useClientIdsEffects();

  return (
    <section style={{ marginTop: 16 }}>
      <GenericTable<GetAllClientsResponseDto>
        headers={CLIENT_IDS_HEADERS}
        tableRows={clientIds}
        loading={isLoading}
        showFooter={true}
        actions={actions}
        defaultSortBy='clientId'
        defaultOrder='asc'
        showCheckbox={true}
        setSelectedItems={setSelectedItems}
      >
        <CreateButton onCreate={removeClientIds} buttonText='Remove'/>
      </GenericTable>
    </section>
  );
};
