import { useRouter } from 'next/router';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useIdentity } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export const useGatewayIdentityEffects = () => {
  const router = useRouter();
  const { identity } = useIdentity();
  const Swal = useCustomAlert();

  const namespace =
    process.env['NEXT_PUBLIC_PARENT_NAMESPACE'] ??
    'ddhub.apps.energyweb.iam.ewc';

  const update = async () => {
    const result = await Swal.warning({
      text: 'you will be logged out if you wish to proceed',
    });

    if (result.isConfirmed) {
      router.push({
        pathname: routerConst.InitialPage,
        query: { import: true },
      });
    }
  };

  return {
    update,
    identity,
    namespace,
  };
};
