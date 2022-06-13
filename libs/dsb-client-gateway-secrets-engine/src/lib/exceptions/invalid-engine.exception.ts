import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';
import { SecretsEngine } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

export class InvalidEngineException extends BaseException {
  constructor() {
    super(
      'Invalid secrets engine specified',
      DsbClientGatewayErrors.SECRETS_ENGINE_INVALID,
      {
        allowedValues: [SecretsEngine.AWS, SecretsEngine.VAULT],
      }
    );
  }
}
