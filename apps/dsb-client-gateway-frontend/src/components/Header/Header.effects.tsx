import { useIdentity } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useHeaderEffects = () => {
  const {identity} = useIdentity();

  const did = identity?.enrolment?.did;

  return {did};
}
