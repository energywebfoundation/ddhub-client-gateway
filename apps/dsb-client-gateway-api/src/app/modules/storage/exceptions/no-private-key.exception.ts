import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class NoPrivateKeyException extends BaseException {
  constructor() {
    super('No private key', DsbClientGatewayErrors.ID_NO_PRIVATE_KEY, null);
  }
}
