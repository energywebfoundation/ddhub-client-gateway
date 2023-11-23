import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class IamNotInitializedException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Invalid private key or IAM not initialized',
      DsbClientGatewayErrors.IAM_NOT_INITIALIZED,
    );
  }
}
