import { Module } from '@nestjs/common';
import { LokiService } from './service';
import { DidRepository } from './repository/did.repository';

@Module({
  controllers: [],
  providers: [LokiService, DidRepository],
  exports: [LokiService, DidRepository],
})
export class DsbClientGatewayStorageModule {}
