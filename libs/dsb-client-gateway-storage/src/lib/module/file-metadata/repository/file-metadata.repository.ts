import { FileMetadataEntity } from '../entity/file-metadata.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FileMetadataEntity)
export class FileMetadataRepository extends Repository<FileMetadataEntity> {}
