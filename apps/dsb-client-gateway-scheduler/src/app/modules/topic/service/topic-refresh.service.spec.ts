import {Test, TestingModule} from '@nestjs/testing';
import {TopicRefreshService} from './topic-refresh.service';
import {
  ApplicationEntity,
  ApplicationWrapperRepository,
  CronJobType,
  CronWrapperRepository,
  TopicMonitorEntity,
  TopicMonitorRepositoryWrapper,
  TopicRepositoryWrapper
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {IamService} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DdhubTopicsService,
  SchemaType,
  TopicDataResponse,
  TopicMonitorUpdates, TopicVersionResponse
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {SchedulerRegistry} from '@nestjs/schedule';
import {ConfigService} from '@nestjs/config';
import {CommandBus} from '@nestjs/cqrs';
import moment from 'moment';
import {TopicDeletedCommand} from "../../channel/command/topic-deleted.command";

describe('TopicRefreshService', () => {
  let service: TopicRefreshService;
  let error: Error | null;
  let result: unknown | null;

  const topicRepositoryWrapperMock = {
    topicRepository: {
      save: jest.fn(),
      delete: jest.fn(),
    },
  };

  const iamServiceMock = {
    isInitialized: jest.fn(),
  };

  const applicationsWrapperMock = {
    repository: {
      find: jest.fn(),
    },
  };

  const ddhubTopicsServiceMock = {
    getTopics: jest.fn(),
    getTopicVersions: jest.fn(),
    topicUpdatesMonitor: jest.fn(),
  };

  const schedulerRegistryMock = {
    addCronJob: jest.fn(),
  };

  const cronWrapperMock = {
    cronRepository: {
      save: jest.fn(),
    },
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const commandBusMock = {
    execute: jest.fn(),
  };

  const topicMonitorWrapperMock = {
    topicRepository: {
      get: jest.fn(),
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicRefreshService,
        {
          provide: TopicRepositoryWrapper,
          useValue: topicRepositoryWrapperMock,
        },
        {
          provide: IamService,
          useValue: iamServiceMock,
        },
        {
          provide: ApplicationWrapperRepository,
          useValue: applicationsWrapperMock,
        },
        {
          provide: DdhubTopicsService,
          useValue: ddhubTopicsServiceMock,
        },
        {
          provide: SchedulerRegistry,
          useValue: schedulerRegistryMock,
        },
        {
          provide: CronWrapperRepository,
          useValue: cronWrapperMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: CommandBus,
          useValue: commandBusMock,
        },
        {
          provide: TopicMonitorRepositoryWrapper,
          useValue: topicMonitorWrapperMock,
        },
      ],
    }).compile();

    service = module.get<TopicRefreshService>(TopicRefreshService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(TopicRefreshService);
  });

  describe('refreshTopics()', () => {
    describe('should delete only one topic', () => {
      beforeEach(async () => {
        iamServiceMock.isInitialized = jest.fn().mockImplementationOnce(() => true);

        applicationsWrapperMock.repository.find = jest.fn().mockImplementationOnce(async () => {
          return [{
            roles: ['role1'],
            updatedDate: new Date(),
            createdDate: new Date(),
            topicsCount: 2,
            namespace: 'topicOwner',
            appName: 'appName',
          }] as ApplicationEntity[];
        });

        topicMonitorWrapperMock.topicRepository.get = jest.fn().mockImplementationOnce(async () => {
          return [{
            createdDate: new Date(),
            lastTopicVersionUpdate: moment().subtract('4', 'hours').toDate(),
            updatedDate: new Date(),
            owner: 'topicOwner',
            lastTopicUpdate: moment().subtract('4', 'hours').toDate(),
          }] as TopicMonitorEntity[];
        })

        ddhubTopicsServiceMock.topicUpdatesMonitor = jest.fn().mockImplementationOnce(async () => {
          return [{
            id: 'monitorId',
            owner: 'topicOwner',
            lastTopicUpdate: moment().toDate().getTime(),
          }] as TopicMonitorUpdates[];
        });

        ddhubTopicsServiceMock.getTopicVersions = jest.fn().mockImplementationOnce(async () => {
          return {
            count: 2,
            limit: 1,
            page: 1,
            records: [{
              name: 'topicName',
              owner: 'topicOwner',
              deleted: false,
              id: 'topicId',
              schema: {},
              tags: [],
              version: '0.0.1',
              schemaType: SchemaType.JSD7
            }]
          } as TopicVersionResponse;
        }).mockImplementationOnce(async () => {
          return {
            count: 0,
            limit: 1,
            page: 2,
            records: [],
          } as TopicVersionResponse
        })
          .mockImplementationOnce(async () => {
          return {
            count: 1,
            limit: 1,
            page: 1,
            records: [{
              name: 'topicNameDelete',
              owner: 'topicOwner',
              deleted: true,
              id: 'topicId2',
              schema: {},
              tags: [],
              version: '0.0.1',
              schemaType: SchemaType.JSD7
            }]
          } as TopicVersionResponse;
        })
          .mockImplementationOnce(async () => {
            return {
              count: 0,
              limit: 1,
              page: 2,
              records: [],
            } as TopicVersionResponse
          })

        ddhubTopicsServiceMock.getTopics = jest.fn().mockImplementationOnce(async () => {
          return {
            count: 1,
            limit: 1,
            page: 1,
            records: [{
              createdDate: new Date().toISOString(),
              name: 'topicName',
              owner: 'topicOwner',
              deleted: false,
              id: 'topicId',
              schema: 'some-schema',
              tags: [],
              updatedDate: new Date().toISOString(),
              version: '0.0.1',
              schemaType: SchemaType.JSD7
            }, {
              createdDate: new Date().toISOString(),
              name: 'topicNameDelete',
              owner: 'topicOwner',
              deleted: true,
              id: 'topicId2',
              schema: 'some-schema',
              tags: [],
              updatedDate: new Date().toISOString(),
              version: '0.0.1',
              schemaType: SchemaType.JSD7
            }]
          } as TopicDataResponse;
        }).mockImplementationOnce(async () => {
          return {
            count: 0,
            limit: 1,
            page: 2,
            records: []
          } as TopicDataResponse;
        })

        try {
          await service.refreshTopics();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should check if iam is initialized', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should fetch existing applications', () => {
        expect(applicationsWrapperMock.repository.find).toBeCalledTimes(1);
      });

      it('should fetch topic monitors from ddhub', () => {
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledWith(
          ['topicOwner']
        );
      });

      it('should fetch existing topic monitors', () => {
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledTimes(1);
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledWith(['topicOwner']);
      });

      it('should fetch topics', () => {
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledTimes(2);
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledWith(50, 'topicOwner', 1, true);
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledWith(50, 'topicOwner', 2, true);
      });

      it('should delete marked topic', () => {
        expect(topicRepositoryWrapperMock.topicRepository.delete).toBeCalledTimes(1);

        expect(topicRepositoryWrapperMock.topicRepository.delete).toHaveBeenNthCalledWith(1, {
          owner: 'topicOwner',
          name: 'topicNameDelete',
          id: 'topicId2',
        });

        expect(commandBusMock.execute).toBeCalledTimes(1);
        expect(commandBusMock.execute).toBeCalledWith(
          new TopicDeletedCommand('topicNameDelete', 'topicOwner', 'topicId2')
        )
      });

      it('should fetch available topic versions', () => {
        expect(ddhubTopicsServiceMock.getTopicVersions).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.getTopicVersions).toBeCalledWith('topicId');
      });

      it('should store new topic', () => {
        expect(topicRepositoryWrapperMock.topicRepository.save).toBeCalledTimes(1);
        expect(topicRepositoryWrapperMock.topicRepository.save).toBeCalledWith({
          id: 'topicId',
          owner: 'topicOwner',
          name: 'topicName',
          schemaType: SchemaType.JSD7,
          version: '0.0.1',
          schema: {},
          tags: [],
          majorVersion: '0',
          minorVersion: '0',
          patchVersion: '1'
        })
      });

      it('should update topic monitor', () => {
        expect(topicMonitorWrapperMock.topicRepository.save).toBeCalledTimes(1);
        expect(topicMonitorWrapperMock.topicRepository.save).toBeCalledWith({
          owner: 'topicOwner',
          lastTopicUpdate: expect.any(Date),
          lastTopicVersionUpdate: expect.any(Date)
        })
      })
    })

    describe('should not update as no changes were made', () => {
      beforeEach(async () => {
        iamServiceMock.isInitialized = jest.fn().mockImplementationOnce(() => true);

        applicationsWrapperMock.repository.find = jest.fn().mockImplementationOnce(async () => {
          return [{
            roles: ['role1'],
            updatedDate: new Date(),
            createdDate: new Date(),
            topicsCount: 2,
            namespace: 'topicOwner',
            appName: 'appName',
          }] as ApplicationEntity[];
        });

        topicMonitorWrapperMock.topicRepository.get = jest.fn().mockImplementationOnce(async () => {
          return [{
            createdDate: new Date(),
            lastTopicVersionUpdate: moment().subtract('4', 'hours').toDate(),
            updatedDate: new Date(),
            owner: 'topicOwner',
            lastTopicUpdate: moment().subtract('4', 'hours').toDate(),
          }] as TopicMonitorEntity[];
        })

        ddhubTopicsServiceMock.topicUpdatesMonitor = jest.fn().mockImplementationOnce(async () => {
          return [{
            id: 'monitorId',
            owner: 'topicOwner',
            lastTopicUpdate: moment().toDate().getTime(),
          }] as TopicMonitorUpdates[];
        });

        ddhubTopicsServiceMock.getTopics = jest.fn().mockImplementationOnce(async () => {
          return {
            count: 0,
            limit: 1,
            page: 2,
            records: []
          } as TopicDataResponse;
        })

        try {
          await service.refreshTopics();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should check if iam is initialized', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should fetch existing applications', () => {
        expect(applicationsWrapperMock.repository.find).toBeCalledTimes(1);
      });

      it('should fetch topic monitors from ddhub', () => {
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledWith(
          ['topicOwner']
        );
      });

      it('should fetch existing topic monitors', () => {
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledTimes(1);
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledWith(['topicOwner']);
      });

      it('should fetch topics', () => {
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledWith(50, 'topicOwner', 1, true);
      });

      it('should not delete topic', () => {
        expect(topicRepositoryWrapperMock.topicRepository.delete).toBeCalledTimes(0);
      });

      it('should not fetch available topic versions', () => {
        expect(ddhubTopicsServiceMock.getTopicVersions).toBeCalledTimes(0);
      });

      it('should not store new topic', () => {
        expect(topicRepositoryWrapperMock.topicRepository.save).toBeCalledTimes(0);
      });

      it('should update topic monitor', () => {
        expect(topicMonitorWrapperMock.topicRepository.save).toBeCalledTimes(1);
        expect(topicMonitorWrapperMock.topicRepository.save).toBeCalledWith({
          owner: 'topicOwner',
          lastTopicUpdate: expect.any(Date),
          lastTopicVersionUpdate: expect.any(Date)
        })
      })
    })

    describe('should update topic', () => {
      beforeEach(async () => {
        iamServiceMock.isInitialized = jest.fn().mockImplementationOnce(() => true);

        applicationsWrapperMock.repository.find = jest.fn().mockImplementationOnce(async () => {
          return [{
            roles: ['role1'],
            updatedDate: new Date(),
            createdDate: new Date(),
            topicsCount: 2,
            namespace: 'topicOwner',
            appName: 'appName',
          }] as ApplicationEntity[];
        });

        topicMonitorWrapperMock.topicRepository.get = jest.fn().mockImplementationOnce(async () => {
          return [{
            createdDate: new Date(),
            lastTopicVersionUpdate: moment().subtract('4', 'hours').toDate(),
            updatedDate: new Date(),
            owner: 'topicOwner',
            lastTopicUpdate: moment().subtract('4', 'hours').toDate(),
          }] as TopicMonitorEntity[];
        })

        ddhubTopicsServiceMock.topicUpdatesMonitor = jest.fn().mockImplementationOnce(async () => {
          return [{
            id: 'monitorId',
            owner: 'topicOwner',
            lastTopicUpdate: moment().toDate().getTime(),
          }] as TopicMonitorUpdates[];
        });

        ddhubTopicsServiceMock.getTopicVersions = jest.fn().mockImplementationOnce(async () => {
          return {
            count: 1,
            limit: 1,
            page: 1,
            records: [{
              name: 'topicName',
              owner: 'topicOwner',
              deleted: false,
              id: 'topicId',
              schema: {},
              tags: [],
              version: '0.0.1',
              schemaType: SchemaType.JSD7
            }]
          } as TopicVersionResponse;
        });

        ddhubTopicsServiceMock.getTopics = jest.fn().mockImplementationOnce(async () => {
          return {
            count: 1,
            limit: 1,
            page: 1,
            records: [{
              createdDate: new Date().toISOString(),
              name: 'topicName',
              owner: 'topicOwner',
              deleted: false,
              id: 'topicId',
              schema: 'some-schema',
              tags: [],
              updatedDate: new Date().toISOString(),
              version: '0.0.1',
              schemaType: SchemaType.JSD7
            }]
          } as TopicDataResponse;
        }).mockImplementationOnce(async () => {
          return {
            count: 0,
            limit: 1,
            page: 2,
            records: []
          } as TopicDataResponse;
        })

        try {
          await service.refreshTopics();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should check if iam is initialized', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should fetch existing applications', () => {
        expect(applicationsWrapperMock.repository.find).toBeCalledTimes(1);
      });

      it('should fetch topic monitors from ddhub', () => {
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledWith(
          ['topicOwner']
        );
      });

      it('should fetch existing topic monitors', () => {
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledTimes(1);
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledWith(['topicOwner']);
      });

      it('should fetch topics', () => {
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledTimes(2);
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledWith(50, 'topicOwner', 1, true);
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledWith(50, 'topicOwner', 2, true);
      });

      it('should not delete topic', () => {
        expect(topicRepositoryWrapperMock.topicRepository.delete).toBeCalledTimes(0);
      });

      it('should fetch available topic versions', () => {
        expect(ddhubTopicsServiceMock.getTopicVersions).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.getTopicVersions).toBeCalledWith('topicId');
      });

      it('should store new topic', () => {
        expect(topicRepositoryWrapperMock.topicRepository.save).toBeCalledTimes(1);
        expect(topicRepositoryWrapperMock.topicRepository.save).toBeCalledWith({
          id: 'topicId',
          owner: 'topicOwner',
          name: 'topicName',
          schemaType: SchemaType.JSD7,
          version: '0.0.1',
          schema: {},
          tags: [],
          majorVersion: '0',
          minorVersion: '0',
          patchVersion: '1'
        })
      });

      it('should update topic monitor', () => {
        expect(topicMonitorWrapperMock.topicRepository.save).toBeCalledTimes(1);
        expect(topicMonitorWrapperMock.topicRepository.save).toBeCalledWith({
          owner: 'topicOwner',
          lastTopicUpdate: expect.any(Date),
          lastTopicVersionUpdate: expect.any(Date)
        })
      })
    })

    describe('should not execute as iam is not initalized', () => {
      beforeEach(async () => {
        iamServiceMock.isInitialized = jest.fn().mockImplementationOnce(() => false);

        try {
          await service.refreshTopics();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should check for iam initialization', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(applicationsWrapperMock.repository.find).toBeCalledTimes(0);
        expect(ddhubTopicsServiceMock.topicUpdatesMonitor).toBeCalledTimes(0);
        expect(topicMonitorWrapperMock.topicRepository.get).toBeCalledTimes(0);
        expect(ddhubTopicsServiceMock.getTopics).toBeCalledTimes(0);
        expect(commandBusMock.execute).toBeCalledTimes(0);
      })
    })
  })

  describe('onApplicationBootstrap()', () => {
    describe('should add cron job as its enabled', () => {
      beforeEach(async () => {
        configServiceMock.get = jest.fn().mockImplementation((param: string) => {
          if (param === 'TOPICS_CRON_ENABLED') {
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

      it('should call config service for enabled topics', () => {
        expect(configServiceMock.get).toBeCalledTimes(2);
        expect(configServiceMock.get).toHaveBeenNthCalledWith(1, 'TOPICS_CRON_ENABLED', true);
      });

      it('should call config service for cron expression', () => {
        expect(configServiceMock.get).toBeCalledTimes(2);
        expect(configServiceMock.get).toHaveBeenNthCalledWith(2, 'TOPICS_CRON_SCHEDULE');
      });

      it('should add cron job to registry', () => {
        expect(schedulerRegistryMock.addCronJob).toBeCalledTimes(1);
        expect(schedulerRegistryMock.addCronJob).toBeCalledWith(CronJobType.TOPIC_REFRESH, expect.any(Object));
      })
    })

    describe('should not turn on cron job because config disabled it', () => {
      beforeEach(async () => {
        configServiceMock.get = jest.fn().mockImplementation((param: string) => {
          if (param === 'TOPICS_CRON_ENABLED') {
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
        expect(configServiceMock.get).toBeCalledWith('TOPICS_CRON_ENABLED', true);
      });

      it('should not add cron job to registry', () => {
        expect(schedulerRegistryMock.addCronJob).toBeCalledTimes(0);
      })
    })
  });
});
