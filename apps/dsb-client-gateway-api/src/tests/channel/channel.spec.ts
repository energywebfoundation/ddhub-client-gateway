import { ChannelService } from '../../app/modules/channel/service/channel.service';
import {
  ChannelEntity,
  ChannelType,
  ChannelWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ChannelAlreadyExistsException } from '../../app/modules/channel/exceptions/channel-already-exists.exception';
import {
  DdhubTopicsService,
  SchemaType,
  TopicDataResponse,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ChannelInvalidTopicException } from '../../app/modules/channel/exceptions/channel-invalid-topic.exception';
import { CommandBus } from '@nestjs/cqrs';

const mockedChannelWrapperMock = {
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

describe('ChannelService (SPEC)', () => {
  let channelService: ChannelService;

  beforeEach(() => {
    channelService = new ChannelService(
      mockedChannelWrapperMock as unknown as ChannelWrapperRepository,
      ddhubTopicsServiceMock as unknown as DdhubTopicsService,
      commandBus as unknown as CommandBus
    );
  });

  describe('getChannels', () => {
    it('should return empty array', async () => {
      mockedChannelWrapperMock.channelRepository.getAll = jest
        .fn()
        .mockImplementationOnce(async () => []);

      const result = await channelService.getChannels();

      expect(result).toStrictEqual([]);
    });
  });

  describe('createChannel', () => {
    it('should not create channel as topic type does not match channel type', async () => {
      const obj: TopicDataResponse = {
        limit: 5,
        count: 1,
        page: 1,
        records: [
          {
            id: 'TEST_ID',
            owner: 'TEST_OWNER',
            name: 'TEST_NAME',
            version: '1.0.0',
            deleted: false,
            schemaType: SchemaType.CSV,
            tags: ['TEST'],
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            schema: '',
          },
        ],
      };

      mockedChannelWrapperMock.channelRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => null);

      ddhubTopicsServiceMock.getTopicsByOwnerAndName = jest
        .fn()
        .mockImplementationOnce(async () => obj);

      const payload = {
        fqcn: 'test',
        useAnonymousExtChannel: false,
        type: ChannelType.PUB,
        conditions: {
          topics: [
            {
              owner: obj.records[0].owner,
              topicName: obj.records[0].name,
            },
          ],
          roles: [],
          dids: [],
        },
        payloadEncryption: true,
      };

      try {
        await channelService.createChannel(payload);
        expect(true).toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(ChannelInvalidTopicException);

        expect(ddhubTopicsServiceMock.getTopicsByOwnerAndName).toBeCalledTimes(
          1
        );
        expect(ddhubTopicsServiceMock.getTopicsByOwnerAndName).toBeCalledWith(
          payload.conditions.topics[0].topicName,
          payload.conditions.topics[0].owner
        );

        expect(mockedChannelWrapperMock.channelRepository.save).toBeCalledTimes(
          0
        );
      }
    });

    it('should create channel', async () => {
      const obj: TopicDataResponse = {
        limit: 5,
        count: 1,
        page: 1,
        records: [
          {
            id: 'TEST_ID',
            owner: 'TEST_OWNER',
            name: 'TEST_NAME',
            version: '1.0.0',
            deleted: false,
            schemaType: SchemaType.CSV,
            tags: ['TEST'],
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            schema: '',
          },
        ],
      };

      mockedChannelWrapperMock.channelRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => null);

      ddhubTopicsServiceMock.getTopicsByOwnerAndName = jest
        .fn()
        .mockImplementationOnce(async () => obj);

      const payload = {
        fqcn: 'test',
        type: ChannelType.DOWNLOAD,
        useAnonymousExtChannel: false,
        conditions: {
          topics: [
            {
              owner: obj.records[0].owner,
              topicName: obj.records[0].name,
            },
          ],
          roles: [],
          dids: [],
        },
        payloadEncryption: true,
      };

      await channelService.createChannel(payload);

      expect(ddhubTopicsServiceMock.getTopicsByOwnerAndName).toBeCalledTimes(1);
      expect(ddhubTopicsServiceMock.getTopicsByOwnerAndName).toBeCalledWith(
        payload.conditions.topics[0].topicName,
        payload.conditions.topics[0].owner
      );

      expect(mockedChannelWrapperMock.channelRepository.save).toBeCalledTimes(
        1
      );
    });

    it('should throw an error as channel exists', async () => {
      const channelEntity: ChannelEntity = {
        fqcn: 'test',
        type: ChannelType.DOWNLOAD,
        useAnonymousExtChannel: false,
        conditions: {
          topics: [],
          roles: [],
          dids: [],
          qualifiedDids: [],
        },
        payloadEncryption: true,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      mockedChannelWrapperMock.channelRepository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => channelEntity);

      try {
        await channelService.createChannel({
          fqcn: channelEntity.fqcn,
          type: channelEntity.type,
          useAnonymousExtChannel: false,
          payloadEncryption: channelEntity.payloadEncryption,
          conditions: channelEntity.conditions,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(ChannelAlreadyExistsException);
        expect(
          mockedChannelWrapperMock.channelRepository.findOne
        ).toBeCalledTimes(1);
        expect(ddhubTopicsServiceMock.getTopicsByOwnerAndName).toBeCalledTimes(
          0
        );
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
