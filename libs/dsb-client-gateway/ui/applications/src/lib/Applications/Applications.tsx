import { useApplications } from '@dsb-client-gateway/ui/api-hooks';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { APPLICATIONS_HEADERS } from '../models/applications-header';
import { useRouter } from 'next/router';
import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { routerConst } from '@dsb-client-gateway/ui/utils';

export function Applications() {
  const { applications, isLoading } = useApplications();
  const router = useRouter();

  const handleRowClick = (data: ApplicationDTO) => {
    router.push(
      routerConst.Topics.replace('[namespace]', data.namespace)
    );
  };
  return (
    <div>
      <GenericTable<ApplicationDTO>
        headers={APPLICATIONS_HEADERS}
        tableRows={applications}
        onRowClick={handleRowClick}
        loading={isLoading}
      />
    </div>
  );
}
