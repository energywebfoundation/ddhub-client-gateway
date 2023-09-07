import { Injectable } from '@nestjs/common';
import {
  ReceivedMessageMappingRepository,
  SentMessageRepository,
} from '../repository';

@Injectable()
export class SentMessageRepositoryWrapper {
  constructor(public readonly repository: SentMessageRepository) {}
}
