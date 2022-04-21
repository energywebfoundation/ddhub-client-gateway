import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  ApplicationDTO,
  getApplicationsControllerGetApplicationsQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCachedApplications = () => {
  const queryClient = useQueryClient();
  const cachedApplications: ApplicationDTO[] | undefined =
    queryClient.getQueryData(
      getApplicationsControllerGetApplicationsQueryKey()
    );

  const applicationsByNamespace = keyBy(cachedApplications, 'namespace');

  return {
    cachedApplications,
    applicationsByNamespace,
  };
};
