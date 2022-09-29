import { Module } from '@nestjs/common';
import { MessageService } from './service/message.service';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DdhubClientGatewayEncryptionModule, CronRepositoryModule],
  providers: [MessageService],
})
export class MessageModule {}
