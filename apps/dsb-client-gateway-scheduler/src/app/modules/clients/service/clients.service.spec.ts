import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ClientsService as ClientsLibService } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ClientEntity,
  CronJobType,
  CronStatus,
  CronWrapperRepository
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';

describe('ClientsService', () => {
  let service: ClientsService;
  let error: Error | unknown;
  let result: unknown;

  const clientsLibServiceMock = {
    syncMissingClientsIds: jest.fn(),
    getOutdatedClients: jest.fn(),
    delete: jest.fn(),
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

  beforeEach(async () => {
    jest.clearAllMocks();
    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: ClientsLibService,
          useValue: clientsLibServiceMock,
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
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(ClientsService);
  });

  describe('execute()', () => {
    describe('should sync clients', () => {
      beforeEach(async () => {
        configServiceMock.get = jest.fn().mockImplementationOnce( () => {
          return '7';
        })

        clientsLibServiceMock.getOutdatedClients = jest.fn().mockImplementationOnce(async () => {
          return [{
            createdDate: new Date(),
            updatedDate: new Date(),
            clientId: 'clientId'
          }] as ClientEntity[];
        });

        try {
          await service.execute();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should sync missing clients ids', () => {
        expect(clientsLibServiceMock.syncMissingClientsIds).toBeCalledTimes(1);
      });

      it('should fetch outdated clients', () => {
        expect(clientsLibServiceMock.getOutdatedClients).toBeCalledWith(expect.any(Date));
      });

      it('should delete one client', () => {
        expect(clientsLibServiceMock.delete).toBeCalledTimes(1);
        expect(clientsLibServiceMock.delete).toBeCalledWith('clientId');
      });

      it('should store cron repository', () => {
        expect(cronWrapperMock.cronRepository.save).toBeCalledTimes(1);
        expect(cronWrapperMock.cronRepository.save).toBeCalledWith({
          jobName: CronJobType.CLIENTS,
          latestStatus: CronStatus.SUCCESS,
          executedAt: expect.any(Date)
        })
      })
    })
  })

  describe('onApplicationBootstrap()', () => {
    describe('should add cron job as its enabled', () => {
      beforeEach(async () => {
        configServiceMock.get = jest.fn().mockImplementation((param: string) => {
          if (param === 'CLIENTS_CRON_ENABLED') {
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
        expect(configServiceMock.get).toHaveBeenNthCalledWith(1, 'CLIENTS_CRON_ENABLED', true);
      });

      it('should call config service for cron expression', () => {
        expect(configServiceMock.get).toBeCalledTimes(2);
        expect(configServiceMock.get).toHaveBeenNthCalledWith(2, 'CLIENTS_CRON_SCHEDULE');
      });

      it('should add cron job to registry', () => {
        expect(schedulerRegistryMock.addCronJob).toBeCalledTimes(1);
        expect(schedulerRegistryMock.addCronJob).toBeCalledWith(CronJobType.CLIENTS, expect.any(Object));
      })
    })

    describe('should not turn on cron job because config disabled it', () => {
      beforeEach(async () => {
        configServiceMock.get = jest.fn().mockImplementation((param: string) => {
          if (param === 'CLIENTS_CRON_ENABLED') {
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
        expect(configServiceMock.get).toBeCalledWith('CLIENTS_CRON_ENABLED', true);
      });

      it('should not add cron job to registry', () => {
        expect(schedulerRegistryMock.addCronJob).toBeCalledTimes(0);
      })
    })
  });
});
