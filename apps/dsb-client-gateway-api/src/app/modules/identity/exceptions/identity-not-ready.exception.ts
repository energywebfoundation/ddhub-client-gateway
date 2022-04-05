import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class IdentityNotReadyException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(step: string) {
    super(`Identity not ready. Step: ${step}`);

    this.code = DsbClientGatewayErrors.ID_IAM_INIT_ERROR;
  }
}
