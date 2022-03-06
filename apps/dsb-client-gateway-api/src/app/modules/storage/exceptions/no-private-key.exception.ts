import { BadRequestException } from '@nestjs/common';

export class NoPrivateKeyException extends BadRequestException {
  constructor() {
    super('No private key');
  }
}
