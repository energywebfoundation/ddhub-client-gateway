import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import {
  ApplicationDTO,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ApplicationWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  DdhubTopicsService,
  TopicCountDto,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ConfigService } from '@nestjs/config';

const iamServiceMock = {
  isInitialized: jest.fn(),
  getApplicationsByOwnerAndRole: jest.fn(),
  getDIDAddress: jest.fn(),
};

const schedulerRegistryMock = {
  addCronJob: jest.fn(),
};

const cronWrapperMock = {
  cronRepository: {
    save: jest.fn(),
  },
};

const ddhubTopicServiceMock = {
  getTopicsCountByOwner: jest.fn(),
};

const configServiceMock = {
  get: jest.fn(),
};

const applicationWrapperRepositoryMock = {
  repository: {
    save: jest.fn(),
  },
};

describe('ApplicationService', () => {
  let service: ApplicationService;
  let error: Error | null;
  let result: unknown;

  beforeEach(async () => {
    jest.resetAllMocks();
    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: IamService,
          useValue: iamServiceMock,
        },
        {
          provide: SchedulerRegistry,
          useValue: schedulerRegistryMock,
        },
        {
          provide: ApplicationWrapperRepository,
          useValue: applicationWrapperRepositoryMock,
        },
        {
          provide: CronWrapperRepository,
          useValue: cronWrapperMock,
        },
        {
          provide: DdhubTopicsService,
          useValue: ddhubTopicServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(ApplicationService);
  });

  describe('refreshApplications()', () => {
    describe('should refresh applications', () => {
      beforeEach(async () => {
        iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);

        iamServiceMock.getDIDAddress = jest
          .fn()
          .mockImplementation(() => 'did');

        iamServiceMock.getApplicationsByOwnerAndRole = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                appName: 'appName',
                namespace: 'namespace',
                description: 'description',
                websiteUrl: 'websiteUrl',
                logoUrl: 'logoUrl',
              },
            ] as ApplicationDTO[];
          })
          .mockImplementationOnce(async () => {
            return [
              {
                appName: 'appName2',
                namespace: 'namespace2',
                description: 'description',
                websiteUrl: 'websiteUrl',
                logoUrl: 'logoUrl',
              },
            ] as ApplicationDTO[];
          });

        ddhubTopicServiceMock.getTopicsCountByOwner = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                count: 1,
                owner: 'namespace2',
              },
              {
                count: 2,
                owner: 'namespace',
              },
            ] as TopicCountDto[];
          });

        try {
          await service.refreshApplications();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should call iam service to check if initialized', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should fetch roles', () => {
        expect(iamServiceMock.getApplicationsByOwnerAndRole).toBeCalledTimes(2);

        expect(iamServiceMock.getApplicationsByOwnerAndRole).toBeCalledWith(
          'user',
          'did'
        );
        expect(iamServiceMock.getApplicationsByOwnerAndRole).toBeCalledWith(
          'topiccreator',
          'did'
        );
      });

      it('should store both applications', () => {
        expect(
          applicationWrapperRepositoryMock.repository.save
        ).toBeCalledTimes(2);

        expect(
          applicationWrapperRepositoryMock.repository.save
        ).toHaveBeenNthCalledWith(1, {
          appName: 'appName',
          description: 'description',
          websiteUrl: 'websiteUrl',
          logoUrl: 'logoUrl',
          namespace: 'namespace',
          topicsCount: 2,
          roles: ['user'],
        });

        expect(
          applicationWrapperRepositoryMock.repository.save
        ).toHaveBeenNthCalledWith(2, {
          appName: 'appName2',
          description: 'description',
          websiteUrl: 'websiteUrl',
          logoUrl: 'logoUrl',
          namespace: 'namespace2',
          topicsCount: 1,
          roles: ['topiccreator'],
        });
      });

      it('should fetch topics count per owner', () => {
        expect(ddhubTopicServiceMock.getTopicsCountByOwner).toBeCalledTimes(1);
        expect(ddhubTopicServiceMock.getTopicsCountByOwner).toBeCalledWith([
          'namespace',
          'namespace2',
        ]);
      });

      it('should store cron result', () => {
        expect(cronWrapperMock.cronRepository.save).toBeCalledTimes(1);
        expect(cronWrapperMock.cronRepository.save).toBeCalledWith({
          jobName: CronJobType.APPLICATIONS_REFRESH,
          latestStatus: CronStatus.SUCCESS,
          executedAt: expect.any(Date),
        });
      });
    });

    describe('should not refresh applications as iam is not initialized', () => {
      beforeEach(async () => {
        iamServiceMock.isInitialized = jest
          .fn()
          .mockImplementation(() => false);

        try {
          await service.refreshApplications();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should call iam service to check if initialized', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should store cron result', () => {
        expect(cronWrapperMock.cronRepository.save).toBeCalledTimes(0);
      });

      it('should not execute further methods', () => {
        expect(iamServiceMock.getApplicationsByOwnerAndRole).toBeCalledTimes(0);
        expect(ddhubTopicServiceMock.getTopicsCountByOwner).toBeCalledTimes(0);
        expect(
          applicationWrapperRepositoryMock.repository.save
        ).toBeCalledTimes(0);
      });
    });
  });

  describe('onApplicationBootstrap()', () => {
    describe('should add cron job as its enabled', () => {
      beforeEach(async () => {
        configServiceMock.get = jest
          .fn()
          .mockImplementation((param: string) => {
            if (param === 'APPLICATION_CRON_ENABLED') {
              return true;
            } else {
              return '*/1 * * * *';
            }
          });

        try {
          await service.onApplicationBootstrap();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should call config service for enabled clients cron', () => {
        expect(configServiceMock.get).toBeCalledTimes(2);
        expect(configServiceMock.get).toHaveBeenNthCalledWith(
          1,
          'APPLICATION_CRON_ENABLED',
          true
        );
      });

      it('should call config service for cron expression', () => {
        expect(configServiceMock.get).toBeCalledTimes(2);
        expect(configServiceMock.get).toHaveBeenNthCalledWith(
          2,
          'APPLICATION_CRON_SCHEDULE'
        );
      });

      it('should add cron job to registry', () => {
        expect(schedulerRegistryMock.addCronJob).toBeCalledTimes(1);
        expect(schedulerRegistryMock.addCronJob).toBeCalledWith(
          CronJobType.APPLICATIONS_REFRESH,
          expect.any(Object)
        );
      });
    });

    describe('should not turn on cron job because config disabled it', () => {
      beforeEach(async () => {
        configServiceMock.get = jest
          .fn()
          .mockImplementation((param: string) => {
            if (param === 'APPLICATION_CRON_ENABLED') {
              return false;
            } else {
              return false;
            }
          });

        try {
          await service.onApplicationBootstrap();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should call config service', () => {
        expect(configServiceMock.get).toBeCalledTimes(1);
        expect(configServiceMock.get).toBeCalledWith(
          'APPLICATION_CRON_ENABLED',
          true
        );
      });

      it('should not add cron job to registry', () => {
        expect(schedulerRegistryMock.addCronJob).toBeCalledTimes(0);
      });
    });
  });
});
