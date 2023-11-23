import { Injectable } from '@nestjs/common';
import { PendingAcksRepository } from '../repository/pending-acks.repository';

@Injectable()
export class PendingAcksWrapperRepository {
  constructor(public readonly pendingAcksRepository: PendingAcksRepository) {}
}
