import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class InvalidPrivateKeyException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Invalid private key', DsbClientGatewayErrors.ID_INVALID_PRIVATE_KEY);
  }
}
