import { Injectable } from '@nestjs/common';
import { ReceivedMessageMappingRepository } from '../repository';

@Injectable()
export class ReceivedMessageRepositoryWrapper {
  constructor(public readonly repository: ReceivedMessageMappingRepository) {}
}
