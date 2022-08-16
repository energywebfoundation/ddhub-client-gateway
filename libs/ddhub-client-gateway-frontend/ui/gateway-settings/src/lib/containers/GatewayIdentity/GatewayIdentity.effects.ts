import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  useIdentity,
  useGatewayConfig,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useSetUserDataEffect } from '@ddhub-client-gateway-frontend/ui/login';

export const useGatewayIdentityEffects = () => {
  const { config } = useGatewayConfig();
  const { userData, setUserData } = useSetUserDataEffect();
  const Swal = useCustomAlert();

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

  return {
    update,
    identity: { enrolment: { did: userData.did } },
    namespace,
  };
};
