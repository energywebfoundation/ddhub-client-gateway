import { keyBy } from 'lodash';
import {
  ApplicationDTO,
  useApplicationsControllerGetApplications,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useApplications = (
  role = 'topiccreator',
  topicUrl = routerConst.Topics
) => {
  const router = useRouter();
  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } =
    useApplicationsControllerGetApplications(
      {
        roleName: role,
      },
      {
        query: {
          onError: (err: any) => {
            console.error(err);
            Swal.httpError(err);
          },
        },
      }
    );

  const handleRowClick = (data: ApplicationDTO) => {
    router.push(topicUrl.replace('[namespace]', data.namespace));
  };
  const applications = data ?? ([] as ApplicationDTO[]);
  const applicationsFetched = isSuccess && data !== undefined && !isError;
  const applicationsByNamespace = keyBy(applications, 'namespace');

  return {
    applications,
    isLoading,
    applicationsFetched,
    applicationsByNamespace,
    handleRowClick,
  };
};
