import {
  TTableComponentAction,
  useCustomAlert,
} from '@ddhub-client-gateway-frontend/ui/core';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import {
  UserDetailsDto,
  useUserApiKeyControllerDeleteUser,
  useUserApiKeyControllerGetAllUsers,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUserListEffects = () => {
  const dispatch = useModalDispatch();

  const { mutateAsync: removeUser } = useUserApiKeyControllerDeleteUser();
  const {
    data: users,
    refetch: refetchUsers,
    isLoading,
  } = useUserApiKeyControllerGetAllUsers();

  const Swal = useCustomAlert();

  const actions: TTableComponentAction<UserDetailsDto>[] = [
    {
      label: 'View',
      onClick: (data) =>
        dispatch({
          type: ModalActionsEnum.SHOW_UPDATE,
          payload: {
            username: data.username,
            password: data.password,
          },
        }),
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: async (data) => {
        const result = await Swal.fire({
          title: 'Confirm removal',
          html: `Are you sure you want to remove  <span style="font-weight: 600; color: #FFF;">${data.username}</span>?`,
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning' as const,
        });
        if (result.isConfirmed) {
          try {
            await removeUser({ username: data.username });
            await Swal.success({
              title: 'User removed',
              html: `<span style="font-weight: 600; color: #FFF;">${data.username}</span> has been successfully removed`,
            });
            await refetchUsers();
          } catch (error) {
            const result = await Swal.warning({
              title: `Unable to remove ${data.username}`,
              text: `Unable to complete the removal. Please try again later.`,
              confirmButtonText: 'Try again',
              showCancelButton: true,
              type: 'warning' as const,
            });
            if (result.isConfirmed) {
              try {
                await removeUser({ username: data.username });
              } catch (error) {
                await Swal.error({
                  title: 'Error',
                  html: `An error occurred while removing ${data.username}`,
                });
              }
            }
          }
        }
      },
    },
  ];

  const onCreateHandler = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CREATE,
    });
  };

  return {
    isLoading,
    users: users ?? [],
    actions,
    onCreateHandler,
  };
};
