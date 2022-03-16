import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelAlreadyExistsException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Channel already exists');

    this.code = DsbClientGatewayErrors.CHANNEL_ALREADY_EXISTS;
  }
}
