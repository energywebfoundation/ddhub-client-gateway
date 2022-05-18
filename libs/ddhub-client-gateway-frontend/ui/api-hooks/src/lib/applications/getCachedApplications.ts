import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  ApplicationDTO,
  getApplicationsControllerGetApplicationsQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCachedApplications = (roleName = 'topiccreator') => {
  const queryClient = useQueryClient();
  const cachedApplications: ApplicationDTO[] | undefined =
    queryClient.getQueryData(
      getApplicationsControllerGetApplicationsQueryKey({
        roleName,
      })
    );

  const applicationsByNamespace = keyBy(cachedApplications, 'namespace');

  return {
    cachedApplications,
    applicationsByNamespace,
  };
};
