import { BadRequestException } from '@nestjs/common';
import { ErrorCode } from '../errors.const';

export abstract class CustomBadRequestException extends BadRequestException {
  public errorCode: ErrorCode;
  public reason: string;

  protected constructor() {
    super();
  }
}
