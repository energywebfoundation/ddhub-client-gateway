import { Module } from '@nestjs/common';
import { TopicsController } from './controller/topic.controller';
import {
  ApplicationRepositoryModule,
  DsbClientGatewayStorageModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { TopicService } from './service/topic.service';
import { CertificateModule } from '../certificate/certificate.module';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    TopicRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    CertificateModule,
  ],
  controllers: [TopicsController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
