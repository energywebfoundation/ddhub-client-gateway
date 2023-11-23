import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class AssociationKeyNotAvailableException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'Association key not available',
      DsbClientGatewayErrors.BIP39_ASSOCIATION_KEY_NOT_AVAILABLE,
    );
  }
}
