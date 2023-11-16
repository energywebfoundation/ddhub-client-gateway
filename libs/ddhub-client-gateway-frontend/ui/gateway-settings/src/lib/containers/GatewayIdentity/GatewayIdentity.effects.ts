import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  useIdentity,
  useGatewayConfig,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useUserDataEffects } from '@ddhub-client-gateway-frontend/ui/login';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useGatewayIdentityEffects = () => {
  const { config } = useGatewayConfig();
  const { userData, resetUserData, refreshIdentity } = useUserDataEffects();
  const { identity } = useIdentity(refreshIdentity);
  const Swal = useCustomAlert();
  const dispatch = useModalDispatch();
  const namespace = config?.namespace ?? 'ddhub.apps.energyweb.iam.ewc';

  const resetIdentity = async () => {
    const result = await Swal.warning({
      text: 'The private key will be reset',
    });

    if (result.isConfirmed) {
      await resetUserData();
    }
  };

  const openRolesModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_ROLES,
      payload: {
        open: true,
        data: {
          did: userData.did,
          namespace,
          roles: identity?.enrolment?.roles,
        },
      },
    });
  };

  return {
    resetIdentity,
    identity: { enrolment: { did: userData.did } },
    namespace,
    openRolesModal,
  };
};
