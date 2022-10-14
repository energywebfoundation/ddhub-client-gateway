import { Module } from '@nestjs/common';
import { MessageService } from './service/message.service';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import {
  AcksRepositoryModule,
  CronRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { PendingAcksService } from './service/pending-acks.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    DdhubClientGatewayEncryptionModule,
    CronRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    AcksRepositoryModule,
  ],
  providers: [MessageService, PendingAcksService],
})
export class MessageModule {}
