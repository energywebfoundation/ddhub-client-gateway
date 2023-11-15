import { Test, TestingModule } from '@nestjs/testing';
import { FileCleanerService } from './file-cleaner.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import {
  ConfigDto,
  DdhubConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
  FileMetadataWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import mockfs from 'mock-fs';
import moment from 'moment';
import * as fs from 'fs';

const schedulerRegistryMock: Partial<SchedulerRegistry> = {
  addCronJob: jest.fn(),
};

const cronWrapperRepositoryMock = {
  cronRepository: {
    save: jest.fn(),
  },
};

const configServiceMock: Partial<ConfigService> = {
  get: jest.fn(),
};

const ddhubConfigServiceMock: Partial<DdhubConfigService> = {
  getConfig: jest.fn(),
};

const fileMetadataWrapperRepositoryMock = {
  repository: {
    delete: jest.fn(),
  },
};

describe('FileCleanerService', () => {
  let service: FileCleanerService;
  let error: Error | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    error = null;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileCleanerService,
        {
          provide: CronWrapperRepository,
          useValue: cronWrapperRepositoryMock,
        },
        {
          provide: SchedulerRegistry,
          useValue: schedulerRegistryMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: DdhubConfigService,
          useValue: ddhubConfigServiceMock,
        },
        {
          provide: FileMetadataWrapperRepository,
          useValue: fileMetadataWrapperRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FileCleanerService>(FileCleanerService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(FileCleanerService);
  });

  describe('removeOldFiles()', () => {
    describe('should cleanup files', () => {
      beforeEach(async () => {
        mockfs({
          upload_dir: {
            'another.offline.unenc': mockfs.file({
              content: 'to-delete-2',
              birthtime: moment().subtract(1, 'hour').toDate(),
            }),
            'another1.offline.unenc': mockfs.file({
              content: 'to-not-delete-2',
              birthtime: new Date(),
            }),
          },
          download_dir: {
            'some1.enc': mockfs.file({
              content: 'to-not-delete-1',
              birthtime: new Date(),
            }),
            'some.enc': mockfs.file({
              content: 'to-delete-1',
              birthtime: moment().subtract(1, 'hour').toDate(),
            }),
          },
        });

        configServiceMock.get = jest.fn().mockImplementation((param) => {
          switch (param) {
            case 'DOWNLOAD_FILES_DIR':
              return 'download_dir';
            case 'UPLOAD_FILES_DIR':
              return 'upload_dir';
            case 'DOWNLOAD_FILES_LIFETIME':
              return 2;
            case 'UPLOAD_FILES_LIFETIME':
              return 2;
          }
        });

        ddhubConfigServiceMock.getConfig = jest
          .fn()
          .mockImplementation(async () => {
            return {
              msgExpired: 120_000, // 2 minutes into miliseconds
              msgMaxSize: 100,
              natsMaxClientidSize: 1,
              fileMaxSize: 1,
            } as ConfigDto;
          });

        try {
          await service.removeOldFiles();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('fs should list two remaining files', () => {
        const allFiles = [
          ...fs.readdirSync('download_dir'),
          ...fs.readdirSync('upload_dir'),
        ];

        expect(allFiles).toStrictEqual(['some1.enc', 'another1.offline.unenc']);
      });

      it('should call ddhub config service', () => {
        expect(ddhubConfigServiceMock.getConfig).toBeCalledTimes(2);
      });

      it('should store successful cron status', () => {
        expect(cronWrapperRepositoryMock.cronRepository.save).toBeCalledTimes(
          1
        );

        expect(cronWrapperRepositoryMock.cronRepository.save).toBeCalledWith({
          jobName: CronJobType.FILE_CLEANER,
          latestStatus: CronStatus.SUCCESS,
          executedAt: expect.any(Date),
        });
      });

      it('should delete one downloaded file marked for deletion (download file)', () => {
        expect(
          fileMetadataWrapperRepositoryMock.repository.delete
        ).toBeCalledTimes(1);

        expect(
          fileMetadataWrapperRepositoryMock.repository.delete
        ).toBeCalledWith({
          fileId: 'some',
        });
      });
    });
  });
});
