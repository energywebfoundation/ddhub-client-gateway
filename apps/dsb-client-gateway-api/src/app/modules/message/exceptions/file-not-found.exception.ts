import { NotFoundException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class FileNotFoundException extends NotFoundException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('File not found');
    this.code = DsbClientGatewayErrors.FILE_NOT_FOUND;
  }
}
