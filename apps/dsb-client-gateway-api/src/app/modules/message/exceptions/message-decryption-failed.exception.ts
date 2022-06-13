import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MessageDecryptionFailedException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor(additionalDetails?) {
    super(
      'Message decryption failed',
      DsbClientGatewayErrors.MESSAGE_DECRYPTION_FAILED,
      additionalDetails
    );
  }
}
