import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
  FileMetadataWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CronJob } from 'cron';
import { Span } from 'nestjs-otel';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as fs from 'fs';
import { join } from 'path';
import moment from 'moment';

@Injectable()
export class FileCleanerService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(FileCleanerService.name);

  constructor(
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly wrapper: FileMetadataWrapperRepository
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'FILE_CLEANER_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`File cleaner cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('FILE_CLEANER_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing file cleaner`);

        await this.removeOldFiles();
      }
    );

    await this.schedulerRegistry.addCronJob(CronJobType.FILE_CLEANER, cronJob);

    cronJob.start();
  }

  protected async processFiles(
    path: string,
    lifetimeMinutes: number
  ): Promise<void> {
    const fileNames: string[] = fs.readdirSync(path);

    if (!fileNames.length) {
      this.logger.log('no files to clean');

      return;
    }

    await Promise.all(
      fileNames.map(async (name) => {
        const fullPath: string = join(path, name);

        const fileDetails = fs.statSync(fullPath);

        this.logger.debug(`fetching file ${fullPath}`);

        if (
          moment(fileDetails.birthtime)
            .add(lifetimeMinutes, 'minutes')
            .isSameOrBefore()
        ) {
          this.logger.debug(`file ${fullPath} marked for deletion`);

          fs.unlinkSync(fullPath);
          await this.wrapper.repository.delete({
            fileId: name.replace('.enc', ''),
          });
        } else {
          this.logger.debug(
            `file ${fullPath} is not applicable for deletion, birth date: ${fileDetails.birthtime}`
          );
        }
      })
    );
  }

  @Span('file_clean')
  public async removeOldFiles(): Promise<void> {
    try {
      await this.processFiles(
        this.configService.get<string>('DOWNLOAD_FILES_DIR'),
        this.configService.get<number>('DOWNLOAD_FILES_LIFETIME')
      );

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.FILE_CLEANER,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.FILE_CLEANER,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('refresh dids failed', e);
    }
  }
}
