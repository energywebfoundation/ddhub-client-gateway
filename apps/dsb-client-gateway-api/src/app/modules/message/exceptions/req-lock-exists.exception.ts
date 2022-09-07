import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ReqLockExistsException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('clientId and fqcn locked', DsbClientGatewayErrors.REQ_LOCK);
  }
}
