import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class InternalMessageNotFoundException extends NotFoundException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('Internal Message Not Found');

    this.code = DsbClientGatewayErrors.TOPIC_NOT_FOUND;
  }
}
