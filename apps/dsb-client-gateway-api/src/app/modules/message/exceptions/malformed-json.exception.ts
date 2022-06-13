import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';

export class MalformedJSONException extends BaseException {
  public code: DsbClientGatewayErrors;

  constructor() {
    super(
      'cannot be parsed to JSON object',
      DsbClientGatewayErrors.MESSAGE_PAYLOAD_NOT_PARSED
    );
  }
}
