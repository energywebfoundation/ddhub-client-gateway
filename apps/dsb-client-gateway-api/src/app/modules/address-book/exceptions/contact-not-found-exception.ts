import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ContactNotFoundException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(did: string) {
    super('Contact not found', DsbClientGatewayErrors.CONTACT_NOT_FOUND, {
      did,
    });

    this.code = DsbClientGatewayErrors.CONTACT_NOT_FOUND;
  }
}
