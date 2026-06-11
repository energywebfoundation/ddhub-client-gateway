import { Injectable } from '@nestjs/common';
import { FileMetadataEntity } from '../entity/file-metadata.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FileMetadataRepository extends Repository<FileMetadataEntity> {
  constructor(dataSource: DataSource) {
    super(FileMetadataEntity, dataSource.createEntityManager());
  }
}
