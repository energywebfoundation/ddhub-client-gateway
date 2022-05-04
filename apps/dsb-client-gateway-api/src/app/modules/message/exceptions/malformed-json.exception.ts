import { BadRequestException } from '@nestjs/common';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MalformedJSONException extends BadRequestException {
  public code: DsbClientGatewayErrors;

  constructor(public readonly additionalDetails) {
    super('cannot be parsed to JSON object');
    this.code = DsbClientGatewayErrors.MESSAGE_PAYLOAD_NOT_PARSED;
  }
}
