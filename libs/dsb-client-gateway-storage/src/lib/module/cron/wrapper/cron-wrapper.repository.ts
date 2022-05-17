import { Injectable } from '@nestjs/common';
import { CronRepository } from '../repository/cron.repository';

@Injectable()
export class CronWrapperRepository {
  constructor(public readonly cronRepository: CronRepository) {}
}
