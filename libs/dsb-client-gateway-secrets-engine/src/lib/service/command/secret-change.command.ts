import { SecretType } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

export class SecretChangeCommand {
  constructor(public readonly secretType: SecretType) {}
}
