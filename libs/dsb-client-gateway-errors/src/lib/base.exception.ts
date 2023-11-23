import { DsbClientGatewayErrors } from './dsb-client-gateway-errors';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseException extends Error {
  protected constructor(
    public readonly message: string,
    public readonly code: DsbClientGatewayErrors,
    public readonly additionalDetails?: any,
    public readonly httpCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(message);
  }
}
