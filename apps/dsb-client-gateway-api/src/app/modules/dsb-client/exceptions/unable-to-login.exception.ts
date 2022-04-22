import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class UnableToLoginException extends NotFoundException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Unable to login to Message Broker');

    this.code = DsbClientGatewayErrors.MB_UNABLE_TO_LOGIN;
  }
}
