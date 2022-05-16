import { keyBy } from "lodash";
import {
  ApplicationDTO,
  useApplicationsControllerGetApplications
} from "@dsb-client-gateway/dsb-client-gateway-api-client";
import { useRouter } from "next/router";
import { routerConst } from "@dsb-client-gateway/ui/utils";

export const useApplications = (role = 'topiccreator', topicUrl = routerConst.Topics) => {
  const router = useRouter();
  const { data, isLoading, isSuccess, isError } =
    useApplicationsControllerGetApplications({
      roleName: role,
    });

  const handleRowClick = (data: ApplicationDTO) => {
    router.push(
      topicUrl.replace('[namespace]', data.namespace)
    );
  };
  const applications = data ?? ([] as ApplicationDTO[]);
  const applicationsFetched = isSuccess && data !== undefined && !isError;
  const applicationsByNamespace = keyBy(applications, 'namespace');

  return {
    applications,
    isLoading,
    applicationsFetched,
    applicationsByNamespace,
    handleRowClick
  };
};
