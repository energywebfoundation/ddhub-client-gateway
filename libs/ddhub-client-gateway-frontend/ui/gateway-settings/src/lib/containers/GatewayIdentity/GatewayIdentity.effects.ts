import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useGatewayIdentityEffects = () => {
  const Swal = useCustomAlert();

  const update = async () => {
    const result = await Swal.warning({
      text: 'you will be logged out if you wish to proceed',
    });

    if (result.isConfirmed) {
      console.log('confirm');
    } else {
      console.log('cancel');
    }
  };

  return {
    update,
  };
};
