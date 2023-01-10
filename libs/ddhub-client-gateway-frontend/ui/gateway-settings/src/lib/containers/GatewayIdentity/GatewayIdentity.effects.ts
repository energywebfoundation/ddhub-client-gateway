import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  useIdentity,
  useGatewayConfig,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useSetUserDataEffect } from '@ddhub-client-gateway-frontend/ui/login';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useGatewayIdentityEffects = () => {
  const { config } = useGatewayConfig();
  const { userData, setUserData } = useSetUserDataEffect();
  const { identity } = useIdentity();
  const Swal = useCustomAlert();
  const dispatch = useModalDispatch();
  const namespace = config?.namespace ?? 'ddhub.apps.energyweb.iam.ewc';

  const update = async () => {
    const result = await Swal.warning({
      text: 'You will be logged out if you wish to proceed',
    });

    if (result.isConfirmed) {
      // Setting to null will force the user to be logged out and redirected to private key form
      setUserData(null);
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
    update,
    identity: { enrolment: { did: userData.did } },
    namespace,
    openRolesModal,
  };
};
