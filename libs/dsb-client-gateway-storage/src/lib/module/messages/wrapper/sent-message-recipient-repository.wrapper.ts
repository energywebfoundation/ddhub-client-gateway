import { Injectable } from '@nestjs/common';
import { SentMessageRecipientRepository } from '../repository';

@Injectable()
export class SentMessageRecipientRepositoryWrapper {
  constructor(public readonly repository: SentMessageRecipientRepository) {}
}
