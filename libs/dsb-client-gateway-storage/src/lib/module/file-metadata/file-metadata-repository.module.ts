import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileMetadataEntity } from './entity/file-metadata.entity';
import { FileMetadataRepository } from './repository/file-metadata.repository';
import { FileMetadataWrapperRepository } from './wrapper/file-metadata-wrapper.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileMetadataEntity]),
  ],
  providers: [FileMetadataRepository, FileMetadataWrapperRepository],
  exports: [FileMetadataWrapperRepository],
})
export class FileMetadataRepositoryModule {}
