import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class NotEnoughBalanceException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(address: string) {
    super(`Not enough balance. Address: ${address}`);

    this.code = DsbClientGatewayErrors.ID_NO_BALANCE;
  }
}
