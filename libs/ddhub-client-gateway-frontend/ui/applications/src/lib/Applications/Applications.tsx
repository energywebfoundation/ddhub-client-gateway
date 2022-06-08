import { useApplications } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { APPLICATIONS_HEADERS } from '../models/applications-header';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface ApplicationsProps {
  role?: string;
  topicUrl?: string;
}

export function Applications({ role, topicUrl }: ApplicationsProps) {
  const { applications, isLoading, handleRowClick } = useApplications(
    role,
    topicUrl
  );

  return (
    <section style={{ marginTop: 16 }}>
      <GenericTable<ApplicationDTO>
        headers={APPLICATIONS_HEADERS}
        tableRows={applications}
        onRowClick={handleRowClick}
        loading={isLoading}
        showFooter={false}
        defaultSortBy='namespace'
        defaultOrder='asc'
      />
    </section>
  );
}
