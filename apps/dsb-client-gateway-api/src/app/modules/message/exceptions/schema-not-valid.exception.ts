import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';
import { HttpStatus } from '@nestjs/common';
export class SchemaNotValidException extends BaseException {
  public code: DsbClientGatewayErrors;
  public httpCode: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY

  constructor(public readonly additionalDetails) {
    super('payload does not match the schema for the topic', DsbClientGatewayErrors.GW_INVALID_PAYLOAD);
  }
}
