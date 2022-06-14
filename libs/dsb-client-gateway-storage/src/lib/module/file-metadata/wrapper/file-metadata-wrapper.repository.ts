import { Injectable } from '@nestjs/common';
import { FileMetadataRepository } from '../repository/file-metadata.repository';

@Injectable()
export class FileMetadataWrapperRepository {
  constructor(public readonly repository: FileMetadataRepository) {}
}
