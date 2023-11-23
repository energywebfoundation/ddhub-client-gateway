import { ChannelService } from './channel.service';
import { Test } from '@nestjs/testing';
import {
  ChannelEntity,
  ChannelWrapperRepository,
  ReceivedMessageRepositoryWrapper,
  SentMessageRepositoryWrapper,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  DdhubTopicsService,
  SchemaType,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { CommandBus } from '@nestjs/cqrs';
import { ChannelMessageFormsOnlyException } from '../exceptions/channel-message-forms-only.exception';
import { CreateChannelDto } from '../dto/request/create-channel.dto';
import { ChannelAlreadyExistsException } from '../exceptions/channel-already-exists.exception';
import { ChannelType } from '../channel.const';
import { ChannelQualifiedDids } from '../channel.interface';
import { ChannelNotFoundException } from '../exceptions/channel-not-found.exception';

const mockedChannelWrapperMock = {
  fetch: jest.fn(),
  channelRepository: {
    getAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    getChannelsByType: jest.fn(),
  },
};

const ddhubTopicsServiceMock = {
  getTopicsByOwnerAndName: jest.fn(),
};

const commandBus = {
  execute: jest.fn(),
};

const mockSentMessageRepositoryWrapper = {
  repository: {
    count: jest.fn(),
  },
};

const mockReceivedMessagesRepositoryWrapper = {
  repository: {
    count: jest.fn(),
  },
};

const mockTopicRepositoryWrapper = {
  topicRepository: {
    count: jest.fn(),
    getTopicsAndCountByIds: jest.fn(),
  },
};

describe(`${ChannelService.name}`, () => {
  let service: ChannelService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: ChannelWrapperRepository,
          useValue: mockedChannelWrapperMock,
        },
        {
          provide: DdhubTopicsService,
          useValue: ddhubTopicsServiceMock,
        },
        {
          provide: CommandBus,
          useValue: commandBus,
        },
        {
          provide: SentMessageRepositoryWrapper,
          useValue: mockSentMessageRepositoryWrapper,
        },
        {
          provide: ReceivedMessageRepositoryWrapper,
          useValue: mockReceivedMessagesRepositoryWrapper,
        },
        {
          provide: TopicRepositoryWrapper,
          useValue: mockTopicRepositoryWrapper,
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
  });

  describe('updateChannel()', () => {
    it.todo('should not update channel as forbidden column is changed');
    it.todo('should update channel');
  });

  describe('getChannelOrThrow()', () => {
    let error: Error | null;
    let result: ChannelEntity | null;

    describe('should throw error as channel does not exists', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.getChannelOrThrow('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(ChannelNotFoundException);
      });

      it('should call channel repository', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledWith({
          where: {
            fqcn: 'fqcn',
          },
        });
      });
    });

    describe('should return channel', () => {
      beforeEach(async () => {
        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return { fqcn: 'fqcn' };
          });

        try {
          result = await service.getChannelOrThrow('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(result).toBeDefined();
        expect(error).toBeNull();
      });

      it('result should contain mocked channel', () => {
        expect(result).toEqual({
          fqcn: 'fqcn',
        });
      });

      it('should call channel repository', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledWith({
          where: {
            fqcn: 'fqcn',
          },
        });
      });
    });
  });

  describe('getChannelQualifiedDids()', () => {
    let error: Error | null;
    let result: ChannelQualifiedDids | null;

    beforeEach(async () => {
      error = null;
      result = null;

      mockedChannelWrapperMock.channelRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => {
          return {
            updatedDate: new Date(),
            fqcn: 'fqcn',
            conditions: {
              dids: ['did1', 'did2'],
              qualifiedDids: ['did2', 'did3'],
            },
          };
        });

      try {
        result = await service.getChannelQualifiedDids('fqcn');
      } catch (e) {
        error = e;
      }
    });

    it('should execute', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
    });

    it('result should contain unique combined dids', () => {
      expect(result.fqcn).toBe('fqcn');
      expect(result.qualifiedDids.length).toBe(3);
      expect(result.qualifiedDids).toEqual(['did1', 'did2', 'did3']);
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('updateChannelQualifiedDids()', () => {
    let error: Error | null;
    let result: unknown;

    beforeEach(async () => {
      error = null;
      result = null;

      mockedChannelWrapperMock.channelRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => {
          return {
            conditions: {
              qualifiedDids: [],
            },
          };
        });

      try {
        await service.updateChannelQualifiedDids('fqcn', ['did1', 'did2']);
      } catch (e) {
        error = e;
      }
    });

    it('should execute', () => {
      expect(error).toBeNull();
      expect(result).toBeNull();
    });

    it('should update channel with qualified dids', () => {
      expect(mockedChannelWrapperMock.channelRepository.update).toBeCalledWith(
        'fqcn',
        {
          conditions: {
            qualifiedDids: ['did1', 'did2'],
          },
        }
      );
    });
  });

  describe('createChannel()', () => {
    describe('should create channel', () => {
      let error: Error | null;
      let result: unknown;

      const channelPayload: CreateChannelDto = {
        fqcn: 'fqcn',
        type: ChannelType.SUB,
        messageForms: false,
        conditions: {
          responseTopics: [
            {
              responseTopicId: 'TOPIC-1',
              topicName: 'responseTopicName',
              owner: 'responseTopicOwner',
            },
          ],
          dids: ['did1'],
          roles: ['role1'],
          topics: [
            {
              owner: 'topicOwner',
              topicName: 'topicName',
            },
          ],
        },
        payloadEncryption: false,
        useAnonymousExtChannel: false,
      };

      beforeEach(async () => {
        jest.resetAllMocks();

        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => null);

        ddhubTopicsServiceMock.getTopicsByOwnerAndName = jest
          .fn()
          .mockResolvedValueOnce({
            count: 1,
            limit: 1,
            page: 1,
            records: [
              {
                id: 'TOPIC-1',
                name: 'topicName',
                owner: 'topicOwner',
                schemaType: SchemaType.JSD7,
              },
            ],
          })
          .mockResolvedValueOnce({
            count: 1,
            limit: 1,
            page: 1,
            records: [
              {
                id: 'RESPONSE-TOPIC-1',
                name: 'responseTopicName',
                owner: 'responseTopicOwner',
                schemaType: SchemaType.JSD7,
              },
            ],
          });

        mockTopicRepositoryWrapper.topicRepository.getTopicsAndCountByIds = jest
          .fn()
          .mockResolvedValue([[], 1]);

        mockTopicRepositoryWrapper.topicRepository.count = jest
          .fn()
          .mockResolvedValue(1);

        try {
          result = await service.createChannel(channelPayload);
        } catch (e) {
          error = e;
        }
      });

      it('should call channel repository', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledWith({
          where: {
            fqcn: 'fqcn',
          },
        });
      });

      it('should execute', () => {
        expect(result).not.toBeDefined();
        expect(error).toBeNull();
      });

      it('should call topics service to obtain information', () => {
        expect(ddhubTopicsServiceMock.getTopicsByOwnerAndName).toBeCalledTimes(
          2
        );

        expect(
          ddhubTopicsServiceMock.getTopicsByOwnerAndName
        ).toHaveBeenNthCalledWith(1, 'topicName', 'topicOwner');

        expect(
          ddhubTopicsServiceMock.getTopicsByOwnerAndName
        ).toHaveBeenNthCalledWith(2, 'responseTopicName', 'responseTopicOwner');
      });

      it('should call topics repository for count', () => {
        expect(
          mockTopicRepositoryWrapper.topicRepository.getTopicsAndCountByIds
        ).toBeCalledTimes(1);
      });

      it('should save channel', () => {
        expect(mockedChannelWrapperMock.channelRepository.save).toBeCalledTimes(
          1
        );

        expect(mockedChannelWrapperMock.channelRepository.save).toBeCalledWith({
          fqcn: channelPayload.fqcn,
          type: channelPayload.type,
          messageForms: channelPayload.messageForms,
          useAnonymousExtChannel: channelPayload.useAnonymousExtChannel,
          payloadEncryption: channelPayload.payloadEncryption,
          conditions: {
            topics: [
              {
                topicName: 'topicName',
                owner: 'topicOwner',
                topicId: 'TOPIC-1',
                schemaType: SchemaType.JSD7,
              },
            ],
            dids: ['did1'],
            roles: ['role1'],
            qualifiedDids: [],
            responseTopics: [
              {
                topicName: 'responseTopicName',
                topicOwner: 'responseTopicOwner',
                topicId: 'RESPONSE-TOPIC-1',
                responseTopicId: 'TOPIC-1',
              },
            ],
          },
        });
      });
    });

    describe('should not create channel as one already exists', () => {
      let error: Error | null;
      let result: unknown;

      beforeEach(async () => {
        jest.resetAllMocks();

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return { fqcn: 'fqcn' };
          });

        error = null;
        result = null;

        try {
          result = await service.createChannel({
            fqcn: 'fqcn',
          } as CreateChannelDto);
        } catch (e) {
          error = e;
        }
      });

      it('should call channel repository', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledWith({
          where: {
            fqcn: 'fqcn',
          },
        });
      });

      it('should not execute as channel already exists', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(ChannelAlreadyExistsException);
      });
    });
  });

  describe('getChannels()', () => {
    describe('should return channels', () => {
      let error: Error | null;
      let result: unknown;

      const channel: ChannelEntity = {
        conditions: {
          topics: [],
          dids: [],
          roles: [],
          responseTopics: [],
          qualifiedDids: [],
        },
        messageForms: false,
        type: ChannelType.PUB,
        fqcn: 'fqcn',
        createdDate: new Date(),
        updatedDate: new Date(),
        payloadEncryption: false,
        useAnonymousExtChannel: false,
      };

      beforeEach(async () => {
        jest.resetAllMocks();

        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.getAll = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [channel];
          });

        try {
          result = await service.getChannels();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(result).toBeDefined();
        expect(error).toBeNull();

        expect(result).toEqual([channel]);
      });

      it('should call channel repository', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.getAll
        ).toBeCalledTimes(1);
      });
    });
  });

  describe('getChannelMessageCount()', () => {
    describe('should return count from sent messages source', () => {
      let error: Error | null;
      let result: unknown;

      const channel: ChannelEntity = {
        conditions: {
          topics: [],
          dids: [],
          roles: [],
          responseTopics: [],
          qualifiedDids: [],
        },
        messageForms: true,
        type: ChannelType.PUB,
        fqcn: 'fqcn',
        createdDate: new Date(),
        updatedDate: new Date(),
        payloadEncryption: false,
        useAnonymousExtChannel: false,
      };

      beforeEach(async () => {
        jest.resetAllMocks();

        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return channel;
          });

        mockSentMessageRepositoryWrapper.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 3);

        try {
          result = await service.getChannelMessageCount('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should call find channel', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
      });

      it('should call sent messages repository', () => {
        expect(
          mockSentMessageRepositoryWrapper.repository.count
        ).toBeCalledTimes(1);
      });

      it('should not call received messages repository', () => {
        expect(
          mockReceivedMessagesRepositoryWrapper.repository.count
        ).toBeCalledTimes(0);
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBe(3);
      });
    });

    describe('should not return count as channel has no message forms enabled', () => {
      let error: Error | null;
      let result: unknown;

      const channel: ChannelEntity = {
        conditions: {
          topics: [],
          dids: [],
          roles: [],
          responseTopics: [],
          qualifiedDids: [],
        },
        messageForms: false,
        type: ChannelType.SUB,
        fqcn: 'fqcn',
        createdDate: new Date(),
        updatedDate: new Date(),
        payloadEncryption: false,
        useAnonymousExtChannel: false,
      };

      beforeEach(async () => {
        jest.resetAllMocks();

        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return channel;
          });

        mockReceivedMessagesRepositoryWrapper.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 2);

        try {
          result = await service.getChannelMessageCount('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should call find channel', () => {
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
      });

      it('should not execute', () => {
        expect(error).toBeInstanceOf(ChannelMessageFormsOnlyException);
      });
    });
  });

  describe('getMultipleChannelsMessageCount()', () => {
    describe('should return empty array as no channels are created', () => {
      let error: Error | null;
      let result: unknown;

      const channel: ChannelEntity = {
        conditions: {
          topics: [],
          dids: [],
          roles: [],
          responseTopics: [],
          qualifiedDids: [],
        },
        messageForms: true,
        type: ChannelType.SUB,
        fqcn: 'fqcn',
        createdDate: new Date(),
        updatedDate: new Date(),
        payloadEncryption: false,
        useAnonymousExtChannel: false,
      };

      beforeEach(async () => {
        jest.resetAllMocks();

        error = null;
        result = null;

        mockedChannelWrapperMock.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return channel;
          });

        mockReceivedMessagesRepositoryWrapper.repository.count = jest
          .fn()
          .mockImplementationOnce(async () => 2);

        mockedChannelWrapperMock.fetch = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [channel];
          });

        try {
          result = await service.getMultipleChannelsMessageCount({});
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();

        expect(result).toBeDefined();
        expect(result).toEqual([
          {
            fqcn: 'fqcn',
            count: 2,
          },
        ]);
      });

      it('should call repository to fetch applicable channels', () => {
        expect(mockedChannelWrapperMock.fetch).toBeCalledTimes(1);
        expect(mockedChannelWrapperMock.fetch).toBeCalledWith({});
      });
    });

    describe('should return empty array as no channels are created', () => {
      let error: Error | null;
      let result: unknown;

      beforeEach(async () => {
        jest.resetAllMocks();

        error = null;
        result = null;

        mockedChannelWrapperMock.fetch = jest
          .fn()
          .mockImplementationOnce(async () => []);

        try {
          result = await service.getMultipleChannelsMessageCount({});
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();

        expect(result).toBeDefined();
        expect(result).toEqual([]);
      });

      it('should call repository to fetch applicable channels', () => {
        expect(mockedChannelWrapperMock.fetch).toBeCalledTimes(1);
        expect(mockedChannelWrapperMock.fetch).toBeCalledWith({});
      });
    });
  });
});
