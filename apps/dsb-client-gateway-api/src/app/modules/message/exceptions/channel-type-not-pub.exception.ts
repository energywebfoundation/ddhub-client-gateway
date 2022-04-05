import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelTypeNotPubException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Channel Type is incorrect.');
    this.code = DsbClientGatewayErrors.CHANNEL_TYPE_INVALID;
  }
}
