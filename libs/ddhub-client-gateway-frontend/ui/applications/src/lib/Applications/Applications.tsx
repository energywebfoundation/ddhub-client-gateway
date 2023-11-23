import { useApplications } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { APPLICATIONS_HEADERS } from '../models/applications-header';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { FC } from 'react';

export interface ApplicationsProps {
  role?: string;
  topicUrl?: string;
}

export const Applications: FC<ApplicationsProps> = (props) => {
  const { role, topicUrl } = props;
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
        showFooter={true}
        defaultSortBy="namespace"
        defaultOrder="asc"
      />
    </section>
  );
};
