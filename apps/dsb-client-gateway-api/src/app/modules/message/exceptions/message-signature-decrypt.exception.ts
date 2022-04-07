import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MessageSignatureNotValidException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('Messages Signature verfication was not Successfull');
    this.code = DsbClientGatewayErrors.SIGNATURE_DOES_NOT_MATCH;
  }
}
