import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OperationOptions } from 'retry';

export interface RetryOptions {
  stopOnStatusCodes?: HttpStatus[];
  stopOnResponseCodes?: string[];
  retryWithAuth?: boolean;
}

@Injectable()
export class RetryConfigService {
  constructor(protected readonly configService: ConfigService) {}

  get config(): OperationOptions {
    return {
      factor: this.configService.get<number>('RETRY_FACTOR', 2),
      retries: this.configService.get<number>('MAX_RETRIES', 10),
      minTimeout: this.configService.get<number>('TIMEOUT', 1000),
    };
  }

  get loginConfig(): OperationOptions {
    return {
      factor: this.configService.get<number>('RETRY_FACTOR', 2),
      retries: this.configService.get<number>('MAX_RETRIES', 10),
      minTimeout: this.configService.get<number>('TIMEOUT', 1000),
      maxTimeout: this.configService.get<number>('MAX_TIMEOUT', 60000),
    };
  }
}
