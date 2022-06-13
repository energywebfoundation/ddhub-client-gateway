import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelAlreadyExistsException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(channelName: string) {
    super(
      'Channel already exists',
      DsbClientGatewayErrors.CHANNEL_ALREADY_EXISTS,
      {
        channelName,
      }
    );
  }
}
