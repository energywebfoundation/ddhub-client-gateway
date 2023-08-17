import { Injectable } from '@nestjs/common';

@Injectable()
export class SentMessageRecipientRepositoryWrapper {
  constructor(
    public readonly repository: SentMessageRecipientRepositoryWrapper
  ) {}
}
