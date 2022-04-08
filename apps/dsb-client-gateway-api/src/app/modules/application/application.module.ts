import { Module } from '@nestjs/common';
import { ApplicationsController } from './controller/application.controller';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { TopicService } from './service/topic.service';
@Module({
  imports: [DsbClientModule, DsbClientGatewayStorageModule],
  providers: [TopicService],
  exports: [],
  controllers: [ApplicationsController],
})
export class ApplicationModule {}
