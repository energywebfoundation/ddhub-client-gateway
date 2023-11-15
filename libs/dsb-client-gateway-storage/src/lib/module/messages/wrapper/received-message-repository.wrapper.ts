import { Injectable } from '@nestjs/common';
import { ReceivedMessageRepository } from '../repository';

@Injectable()
export class ReceivedMessageRepositoryWrapper {
  constructor(public readonly repository: ReceivedMessageRepository) {}
}
