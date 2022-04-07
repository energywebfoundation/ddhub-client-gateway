import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class FileSizeException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('File Size greater then 100 MB not allowed.');
    this.code = DsbClientGatewayErrors.FILE_SIZE_GREATER_THEN_100_MB;
  }
}
