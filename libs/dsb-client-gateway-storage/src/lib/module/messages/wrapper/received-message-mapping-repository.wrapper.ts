import { Injectable } from '@nestjs/common';
import { ReceivedMessageMappingRepository } from '../repository';

@Injectable()
export class ReceivedMessageMappingRepositoryWrapper {
  constructor(public readonly repository: ReceivedMessageMappingRepository) {}
}
