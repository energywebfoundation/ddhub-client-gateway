import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class DirectoryCreatedService implements OnModuleInit {
  protected readonly logger = new Logger(DirectoryCreatedService.name);
  protected readonly uploadPath: string;
  protected readonly downloadPath: string;

  constructor(
    protected readonly configService: ConfigService
  ) {
    this.uploadPath = configService.get<string>('UPLOAD_FILES_DIR');
    this.downloadPath = configService.get<string>('DOWNLOAD_FILES_DIR');
  }

  onModuleInit() {
    fs.promises.mkdir(this.uploadPath, { recursive: true }).catch(error => { this.logger.debug('caught exception : ', error.message); });
    fs.promises.mkdir(this.downloadPath, { recursive: true }).catch(error => { this.logger.debug('caught exception : ', error.message); });
  }
}
