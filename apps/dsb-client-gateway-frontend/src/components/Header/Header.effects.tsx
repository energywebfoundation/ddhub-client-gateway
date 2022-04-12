import { useIdentity } from '@dsb-client-gateway/ui/api-hooks';

export const useHeaderEffects = () => {
  const {identity} = useIdentity();

  const did = identity?.enrolment?.did;

  return {did};
}
