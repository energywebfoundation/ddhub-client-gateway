import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { useInterceptors } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { VersionService } from '@dsb-client-gateway/ddhub-client-gateway-version';

@Injectable()
export class DdhubLogService implements OnModuleInit {
  protected readonly logger = new Logger(DdhubLogService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly ddhubVersionService: VersionService
  ) {}

  onModuleInit(): void {
    useInterceptors(this.httpService, this.logger, this.ddhubVersionService);
  }
}
