import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class RecipientsNotFoundException extends NotFoundException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('No recipients present!');
    this.code = DsbClientGatewayErrors.RECIPIENTS_NOT_PRESENT;
  }
}
