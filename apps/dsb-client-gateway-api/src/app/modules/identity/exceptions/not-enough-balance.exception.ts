import { BadRequestException } from '@nestjs/common';

export class NotEnoughBalanceException extends BadRequestException {
  constructor() {
    super('Address has not got enough balance');
  }
}
