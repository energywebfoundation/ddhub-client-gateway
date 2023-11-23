import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class UnableToLoginException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Unable to login to Message Broker',
      DsbClientGatewayErrors.MB_UNABLE_TO_LOGIN,
    );
  }
}
