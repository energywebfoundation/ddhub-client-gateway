import {
  BaseException,
  DsbClientGatewayErrors,
} from '@dsb-client-gateway/dsb-client-gateway-errors';
import { HttpStatus } from '@nestjs/common';

export class ValidationException extends BaseException {
  constructor(errors) {
    super(
      'Validation failed',
      DsbClientGatewayErrors.VALIDATION_FAILED,
      {
        errors,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
