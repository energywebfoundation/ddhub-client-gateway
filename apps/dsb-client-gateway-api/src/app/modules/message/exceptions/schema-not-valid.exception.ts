import { UnprocessableEntityException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class SchemaNotValidException extends UnprocessableEntityException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('payload does not match the schema for the topic');
    this.code = DsbClientGatewayErrors.GW_INVALID_PAYLOAD;
  }
}
