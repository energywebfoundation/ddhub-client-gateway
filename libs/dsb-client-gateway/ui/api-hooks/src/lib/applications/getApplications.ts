import {
  ApplicationDTO,
  applicationsControllerGetApplications,
  getApplicationsControllerGetApplicationsQueryKey
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';

export const useApplications = (role = 'topiccreator') => {
  const [applications, setApplications] = useState<ApplicationDTO[]>([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.fetchQuery(getApplicationsControllerGetApplicationsQueryKey(), () => applicationsControllerGetApplications({roleName: role})).then((res: ApplicationDTO[]) => {
      setApplications(res);
    }).catch(console.error);
  }, []);

  return {applications};
};


