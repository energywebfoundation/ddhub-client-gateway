import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { useErrorHandler } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Injectable()
export class DdhubLogService implements OnModuleInit {
  protected readonly logger = new Logger(DdhubLogService.name);

  constructor(protected readonly httpService: HttpService) {}

  onModuleInit(): void {
    useErrorHandler(this.httpService, this.logger);
  }
}
