import { Injectable } from '@nestjs/common';
import { AcksRepository } from '../repository/acks.repository';
import { PendingAcksRepository } from '../repository/pending-acks.repository';

@Injectable()
export class PendingAcksWrapperRepository {
  constructor(
    public readonly pendingAcksRepository: PendingAcksRepository
  ) { }
}
