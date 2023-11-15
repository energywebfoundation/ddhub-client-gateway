import { Module } from '@nestjs/common';
import { FileCleanerService } from './service/file-cleaner.service';
import {
  CronRepositoryModule,
  FileMetadataRepositoryModule,
  MessagesRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    CronRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    FileMetadataRepositoryModule,
    MessagesRepositoryModule,
  ],
  providers: [FileCleanerService],
})
export class FileMessagesModule {}
