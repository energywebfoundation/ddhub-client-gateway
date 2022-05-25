import { Module } from '@nestjs/common';
import { FileCleanerService } from './service/file-cleaner.service';
import {
  CronRepositoryModule,
  FileMetadataRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [CronRepositoryModule, FileMetadataRepositoryModule],
  providers: [FileCleanerService],
})
export class FileMessagesModule {}
