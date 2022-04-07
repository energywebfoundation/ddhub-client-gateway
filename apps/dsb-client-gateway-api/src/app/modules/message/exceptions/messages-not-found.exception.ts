import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MessagesNotFoundException extends NotFoundException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('No Messages present to Consume!');
    this.code = DsbClientGatewayErrors.MESSAGES_NOT_PRESENT;
  }
}
