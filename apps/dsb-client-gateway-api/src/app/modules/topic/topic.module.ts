import { Module } from '@nestjs/common';
import { TopicsController } from './controller/topic.controller';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DsbClientModule, DsbClientGatewayStorageModule],
  providers: [],
  exports: [],
  controllers: [TopicsController],
})
export class TopicModule {}
