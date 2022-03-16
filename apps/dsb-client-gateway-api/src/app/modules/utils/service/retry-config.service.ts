import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RetryConfigService {
  constructor(protected readonly configService: ConfigService) {}

  get config(): {
    retries: number;
    factor: number;
    minTimeout: number;
  } {
    return {
      factor: this.configService.get<number>('RETRY_FACTOR', 2),
      retries: this.configService.get<number>('MAX_RETRIES', 10),
      minTimeout: this.configService.get<number>('TIMEOUT', 1000),
    };
  }
}
