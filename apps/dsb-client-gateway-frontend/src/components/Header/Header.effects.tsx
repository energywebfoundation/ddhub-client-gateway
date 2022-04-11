import { useIdentity } from '../../utils/use-identity.effect';

export const useHeaderEffects = () => {
  const {identity} = useIdentity();

  const did = identity?.enrolment?.did;

  return {did};
}
