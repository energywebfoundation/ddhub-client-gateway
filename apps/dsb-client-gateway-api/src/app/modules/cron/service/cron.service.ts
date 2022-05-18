import { Injectable } from '@nestjs/common';
import {
  CronEntity,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class CronService {
  constructor(protected readonly wrapper: CronWrapperRepository) {}

  public async get(): Promise<CronEntity[]> {
    return this.wrapper.cronRepository.find();
  }
}
