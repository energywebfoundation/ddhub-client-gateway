import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class NoPrivateKeyException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super('No private key');

    this.code = DsbClientGatewayErrors.ID_NO_PRIVATE_KEY;
  }
}
