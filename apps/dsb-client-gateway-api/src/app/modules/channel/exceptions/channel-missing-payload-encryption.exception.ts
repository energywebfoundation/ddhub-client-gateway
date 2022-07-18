import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelMissingPayloadEncryptionException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'PUB/UPLOAD channels type must have payload encryption',
      DsbClientGatewayErrors.CHANNEL_MISSING_PAYLOAD_ENCRYPTION
    );
  }
}
