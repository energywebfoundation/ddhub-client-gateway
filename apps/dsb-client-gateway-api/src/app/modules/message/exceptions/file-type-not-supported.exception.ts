import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class FIleTypeNotSupportedException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails?) {
    super('File Type should be csv.');
    this.code = DsbClientGatewayErrors.FILE_TYPE_NOT_MATCHED;
  }
}
