import {
  ApplicationDTO,
  useApplicationsControllerGetApplications,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useApplications = (role = 'topiccreator') => {
  const { data, isLoading } = useApplicationsControllerGetApplications({
    roleName: role,
  });
  const applications = data ?? ([] as ApplicationDTO[]);

  return {
    applications,
    isLoading,
  };
};
