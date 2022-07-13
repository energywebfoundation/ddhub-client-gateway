import { useLoginStatusEffects } from './LoginStatus.effects';

export function LoginStatus() {
  const { statusFactory } = useLoginStatusEffects();

  return statusFactory();
}

export default LoginStatus;
