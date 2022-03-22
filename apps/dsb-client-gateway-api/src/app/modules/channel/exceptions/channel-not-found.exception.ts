import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelNotFoundException extends NotFoundException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Channel not found');

    this.code = DsbClientGatewayErrors.CHANNEL_NOT_FOUND;
  }
}
