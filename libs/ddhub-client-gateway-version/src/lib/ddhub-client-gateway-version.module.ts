import { Module } from '@nestjs/common';
import { VersionService } from './service';

@Module({
  providers: [VersionService],
  exports: [VersionService],
})
export class DdhubClientGatewayVersionModule {}
