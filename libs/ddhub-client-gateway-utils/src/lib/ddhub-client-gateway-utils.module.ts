import { Module } from '@nestjs/common';
import { RetryConfigService } from './services';

@Module({
  controllers: [],
  providers: [RetryConfigService],
  exports: [RetryConfigService],
})
export class DdhubClientGatewayUtilsModule {}
