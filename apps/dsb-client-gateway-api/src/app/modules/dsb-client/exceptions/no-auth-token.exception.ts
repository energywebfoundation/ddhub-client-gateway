import { BadRequestException } from '@nestjs/common';

export class NoAuthTokenException extends BadRequestException {
  constructor() {
    super('No auth token');
  }
}
