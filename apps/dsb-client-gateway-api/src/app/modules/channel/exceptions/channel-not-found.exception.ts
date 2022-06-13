import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelNotFoundException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(channelName: string) {
    super('Channel not found', DsbClientGatewayErrors.CHANNEL_NOT_FOUND, {
      channelName,
    });

    this.code = DsbClientGatewayErrors.CHANNEL_NOT_FOUND;
  }
}
