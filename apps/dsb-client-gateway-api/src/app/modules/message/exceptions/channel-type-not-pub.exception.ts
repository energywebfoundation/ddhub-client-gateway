import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelTypeNotPubException extends BaseException {
  constructor(fqcn: string) {
    super(
      'Channel Type is incorrect',
      DsbClientGatewayErrors.CHANNEL_TYPE_INVALID,
      {
        fqcn,
      }
    );
  }
}
