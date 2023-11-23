import {
  BaseException,
  DsbClientGatewayErrors,
  DsbMessageBrokerErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';
import { MessageBrokerErrors } from '../ddhub-client-gateway-message-broker.const';
import { HttpStatus } from '@nestjs/common';

export class MessageBrokerException extends BaseException {
  constructor(
    message: string,
    code: DsbClientGatewayErrors,
    errorCode: string | MessageBrokerErrors,
    errorCodeMessage: string,
    path: string,
  ) {
    super(
      message,
      code,
      {
        errorCodeName: DsbMessageBrokerErrors[errorCode] || 'UNKNOWN',
        errorCode,
        errorCodeMessage,
        path,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
