import { Module } from '@nestjs/common';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DsbClientGatewayStorageModule],
  providers: [],
  exports: [],
})
export class StorageModule {}
