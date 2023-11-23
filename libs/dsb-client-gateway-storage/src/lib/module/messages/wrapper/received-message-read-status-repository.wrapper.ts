import { Injectable } from '@nestjs/common';
import {
  ReceivedMessageMappingRepository,
  ReceivedMessageReadStatusRepository,
} from '../repository';

@Injectable()
export class ReceivedMessageReadStatusRepositoryWrapper {
  constructor(
    public readonly repository: ReceivedMessageReadStatusRepository
  ) {}
}
