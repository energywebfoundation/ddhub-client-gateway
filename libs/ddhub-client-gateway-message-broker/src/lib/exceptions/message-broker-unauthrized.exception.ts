import {
  BaseException,
  DsbClientGatewayErrors,
  DsbMessageBrokerErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';
import { MessageBrokerErrors } from '../ddhub-client-gateway-message-broker.const';
import { HttpStatus } from '@nestjs/common';

export class MessageBrokerUnauthrizedException extends BaseException {
  constructor(
    message: string,
    code: DsbClientGatewayErrors,
    errorCode: string | MessageBrokerErrors,
    path: string
  ) {
    super(
      message,
      code,
      {
        errorCodeName: DsbMessageBrokerErrors[errorCode] || 'UNKNOWN',
        errorCode,
        path,
      },
      HttpStatus.FORBIDDEN
    );
  }
}
