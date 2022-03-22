import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelUpdateRestrictedFieldsException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('Attempt to update restricted fields (channelName, type)');

    this.code = DsbClientGatewayErrors.CHANNEL_RESTRICTED_FIELDS_UPDATE;
  }
}
