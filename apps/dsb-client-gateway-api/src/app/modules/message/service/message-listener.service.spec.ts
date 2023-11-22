import { MessageListenerService } from './message-listener.service';
import { Test } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ChannelEntity,
  ChannelWrapperRepository,
  CronJobType,
  CronStatus,
  CronWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { MessageService } from './message.service';
import { MessageStoreService } from './message-store.service';
import { ConfigService } from '@nestjs/config';
import { TopicService } from '../../channel/service/topic.service';
import { ChannelType } from '../../channel/channel.const';
import { GetMessageResponse } from '../message.interface';
import { EncryptionStatus } from '../message.const';
import { SchemaType } from '../../topic/topic.const';

const mockConfigService = {
  get: jest.fn(),
};

const mockSchedulerRegistry = {
  addCronJob: jest.fn(),
};

const mockCronWrapperRepository = {
  cronRepository: {
    save: jest.fn(),
  },
};

const mockChannelWrapperRepository = {
  fetch: jest.fn(),
};

const mockMessageService = {
  getMessages: jest.fn(),
};

const mockMessageStoreService = {
  storeReceivedMessage: jest.fn(),
};

const mockTopicService = {
  getTopic: jest.fn(),
};

describe(`${MessageListenerService.name}`, () => {
  let service: MessageListenerService;

  let error: Error | null;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        MessageListenerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
        {
          provide: CronWrapperRepository,
          useValue: mockCronWrapperRepository,
        },
        {
          provide: ChannelWrapperRepository,
          useValue: mockChannelWrapperRepository,
        },
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        {
          provide: MessageStoreService,
          useValue: mockMessageStoreService,
        },
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    }).compile();

    service = app.get<MessageListenerService>(MessageListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(MessageListenerService);
  });

  beforeEach(async () => {
    jest.resetAllMocks();

    error = null;
  });

  describe('execute()', () => {
    describe('should fetch messages and store messages', () => {
      beforeEach(async () => {
        try {
          mockConfigService.get = jest
            .fn()
            .mockImplementation((name: string) => {
              switch (name) {
                case 'FETCH_MESSAGES_CRON_AMOUNT':
                  return 15;
                case 'FETCH_MESSAGES_CRON_CLIENT_ID':
                  return 'clientId';
              }
            });

          mockMessageStoreService.storeReceivedMessage = jest
            .fn()
            .mockImplementation(async () => undefined);

          mockChannelWrapperRepository.fetch = jest
            .fn()
            .mockImplementationOnce(async () => {
              return [
                {
                  fqcn: 'fqcn',
                  conditions: {
                    qualifiedDids: ['senderDid'],
                    topics: [
                      {
                        topicId: 'topicId',
                        topicName: 'topicName',
                        owner: 'topicOwner',
                      },
                    ],
                  },
                },
              ] as ChannelEntity[];
            });

          mockTopicService.getTopic = jest
            .fn()
            .mockImplementationOnce(async () => {
              return {
                name: 'topicName',
              };
            });

          mockMessageService.getMessages = jest
            .fn()
            .mockImplementationOnce(async () => {
              return [
                {
                  topicId: 'topicId',
                  topicName: 'topicName',
                  payload: 'payload',
                  initiatingTransactionId: undefined,
                  transactionId: 'transactionId',
                  initiatingMessageId: undefined,
                  id: 'messageId',
                  signature: 'signature',
                  signatureValid: EncryptionStatus.SUCCESS,
                  topicSchemaType: SchemaType.JSD7,
                  timestampNanos: 1,
                  decryption: {
                    errorMessage: undefined,
                    status: EncryptionStatus.SUCCESS,
                  },
                  sender: 'senderDid',
                  payloadEncryption: true,
                  clientGatewayMessageId: 'cgwid',
                  topicOwner: 'topicOwner',
                  topicVersion: '0.0.1',
                },
              ] as GetMessageResponse[];
            });

          await service.execute();
        } catch (e) {
          error = e;
        }
      });

      it('should store message', () => {
        expect(mockMessageStoreService.storeReceivedMessage).toBeCalledTimes(1);
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should store cron iteration', () => {
        expect(mockCronWrapperRepository.cronRepository.save).toBeCalledTimes(
          1
        );
        expect(mockCronWrapperRepository.cronRepository.save).toBeCalledWith({
          jobName: CronJobType.MESSAGES_FETCH,
          latestStatus: CronStatus.SUCCESS,
          executedAt: expect.any(Date),
        });
      });

      it('should fetch messages', () => {
        expect(mockMessageService.getMessages).toBeCalledTimes(1);
        expect(mockMessageService.getMessages).toBeCalledWith(
          {
            amount: 15,
            fqcn: 'fqcn',
            clientId: 'clientId',
            topicName: 'topicName',
            topicOwner: 'topicOwner',
            from: undefined,
          },
          true,
          true
        );
      });

      it('should call channel wrapper', () => {
        expect(mockChannelWrapperRepository.fetch).toBeCalledTimes(1);
        expect(mockChannelWrapperRepository.fetch).toBeCalledWith({
          type: ChannelType.SUB,
          messageForms: true,
        });
      });
    });

    describe('should not fetch messages as no channels are compatible', () => {
      beforeEach(async () => {
        try {
          mockChannelWrapperRepository.fetch = jest
            .fn()
            .mockImplementationOnce(async () => []);

          await service.execute();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should store cron iteration', () => {
        expect(mockCronWrapperRepository.cronRepository.save).toBeCalledTimes(
          1
        );
        expect(mockCronWrapperRepository.cronRepository.save).toBeCalledWith({
          jobName: CronJobType.MESSAGES_FETCH,
          latestStatus: CronStatus.SUCCESS,
          executedAt: expect.any(Date),
        });
      });

      it('should not call further methods', () => {
        expect(mockMessageService.getMessages).toBeCalledTimes(0);
        expect(mockMessageStoreService.storeReceivedMessage).toBeCalledTimes(0);
      });

      it('should call channel wrapper', () => {
        expect(mockChannelWrapperRepository.fetch).toBeCalledTimes(1);
        expect(mockChannelWrapperRepository.fetch).toBeCalledWith({
          type: ChannelType.SUB,
          messageForms: true,
        });
      });
    });
  });

  describe('onApplicationBootstrap()', () => {
    beforeEach(async () => {
      mockConfigService.get = jest.fn().mockImplementation((name: string) => {
        if (name === 'FETCH_MESSAGES_CRON_ENABLED') {
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

    it('should execute', () => {
      expect(error).toBeNull();
    });

    it('should add cron job to registry', () => {
      expect(mockSchedulerRegistry.addCronJob).toBeCalledTimes(1);
      expect(mockSchedulerRegistry.addCronJob).toBeCalledWith(
        CronJobType.MESSAGES_FETCH,
        expect.any(Object)
      );
    });
  });
});
