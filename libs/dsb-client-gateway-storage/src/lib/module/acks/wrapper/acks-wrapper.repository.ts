import { Injectable } from '@nestjs/common';
import { AcksRepository } from '../repository/acks.repository';

@Injectable()
export class AcksWrapperRepository {
  constructor(public readonly acksRepository: AcksRepository) { }
}
