import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MessageDecryptionFailedException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('Message Decryption Failed.');
    this.code = DsbClientGatewayErrors.MESSAGE_DECRYPTION_FAILED;
  }
}
