import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class ChannelInvalidPayloadEncryptionException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'SUB/DOWNLOAD channels type cannot force payload encryption',
      DsbClientGatewayErrors.CHANNEL_FORCE_PAYLOAD_ENCRYPTION
    );
  }
}
