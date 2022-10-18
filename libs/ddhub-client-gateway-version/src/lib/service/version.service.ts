import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
@Global()
export class VersionService implements OnModuleInit {
  protected readonly logger = new Logger(VersionService.name);
  protected version = 'NOT_DETECTED';

  constructor(protected readonly configService: ConfigService) {}

  public onModuleInit(): void {
    this.loadVersion();
  }

  public loadVersion(): void {
    const path: string | undefined = this.configService.get<string | undefined>(
      'VERSION_FILE_PATH'
    );

    if (!path) {
      this.logger.warn(`no path defined`);

      return;
    }

    const fileExists: boolean = fs.existsSync(path);

    if (!fileExists) {
      this.logger.warn(`version file does not exists`, {
        path,
      });

      return;
    }

    this.version = fs.readFileSync(path).toString().trim();

    this.logger.log(`loaded version ${this.version}`);
  }

  public getVersion(): string {
    return this.version;
  }
}
