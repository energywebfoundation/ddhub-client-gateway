import { Injectable } from '@nestjs/common';
import { ReqLockRepository } from '../repository/req-lock.repository';

@Injectable()
export class ReqLockWrapperRepository {
  constructor(public readonly repository: ReqLockRepository) {}
}
