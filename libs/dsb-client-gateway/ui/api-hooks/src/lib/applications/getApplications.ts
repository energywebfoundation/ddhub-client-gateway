import { keyBy } from 'lodash';
import {
  ApplicationDTO,
  useApplicationsControllerGetApplications,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useApplications = (role = 'topiccreator') => {
  const { data, isLoading, isSuccess } =
    useApplicationsControllerGetApplications({
      roleName: role,
    });
  const applications = data ?? ([] as ApplicationDTO[]);
  const applicationsFetched = isSuccess && data !== undefined;
  const applicationsByNamespace = keyBy(applications, 'namespace');

  return {
    applications,
    isLoading,
    applicationsFetched,
    applicationsByNamespace,
  };
};
