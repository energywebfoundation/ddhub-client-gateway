import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class RecipientsNotFoundException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'No recipients present',
      DsbClientGatewayErrors.RECIPIENTS_NOT_PRESENT
    );
  }
}
