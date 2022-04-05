import { ChannelDidCacheService } from '../../app/modules/channel/service/channel-did-cache.service';
import { IamService } from '../../app/modules/iam-service/service/iam.service';
import { ChannelService } from '../../app/modules/channel/service/channel.service';
import { DsbApiService } from '../../app/modules/dsb-client/service/dsb-api.service';
import { IdentityService } from '../../app/modules/identity/service/identity.service';
import { TopicRepository } from '../../app/modules/channel/repository/topic.repository';

jest.setTimeout(500000);

const iamServiceMock = {
  isInitialized: jest.fn(),
};

const topicRepositoryMock = {
  createOrUpdateTopic: jest.fn(),
};

const channelServiceMock = {
  getChannels: jest.fn(),
  getChannelOrThrow: jest.fn(),
  updateChannelQualifiedDids: jest.fn(),
  updateChannelTopic: jest.fn(),
};

const dsbApiServiceMock = {
  getDIDsFromRoles: jest.fn(),
  getTopicVersions: jest.fn(),
};

const identityServiceMock = {
  identityReady: jest.fn(),
};

const internalChannelMock = {
  fqcn: 'channel.name',
  type: 'sub',
  conditions: {
    topics: [
      {
        topicName: 'test',
        owner: 'test',
        topicId: '622fed6e4258501225095045',
      },
    ],
    dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
    roles: ['user.roles.ddhub.apps.energyweb.iam.ewc'],
    topicsVersions: {},
    realDids: [],
  },
  createdAt: '2022-03-22T08:31:55.910Z',
  updatedAt: '2022-03-22T13:06:48.512Z',
};

const topicVersionsSuccessResponse = {
  count: 1,
  limit: 1,
  page: 1,
  records: [
    {
      name: 'test',
      owner: 'test',
      schema: {
        additionalProperties: false,
        type: 'object',
        properties: {
          data: {
            type: 'string',
          },
        },
        required: ['data'],
      },
      schemaType: 'JSD7',
      tags: [],
      version: '1.0.0',
    },
  ],
};

describe('ChannelDidCacheService (SPEC)', () => {
  let channelDidCacheService: ChannelDidCacheService;

  beforeEach(async () => {
    jest.clearAllMocks();

    // partial mocking - reason behind casting to "any"
    channelDidCacheService = new ChannelDidCacheService(
      iamServiceMock as unknown as IamService,
      channelServiceMock as unknown as ChannelService,
      dsbApiServiceMock as unknown as DsbApiService,
      identityServiceMock as unknown as IdentityService,
      topicRepositoryMock as unknown as TopicRepository
    );
  });

  describe('refreshChannelCache', () => {
    it('should not start job - iam service is not initialized', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => false);

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(0);
    });

    it('should not start job - private key is not set', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);
      identityServiceMock.identityReady = jest
        .fn()
        .mockImplementation(async () => false);

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(1);

      expect(channelServiceMock.getChannels).toBeCalledTimes(0);
    });

    it.skip('should not start job - there are no internal channels', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);
      identityServiceMock.identityReady = jest
        .fn()
        .mockImplementation(async () => true);

      channelServiceMock.getChannelOrThrow = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject('asd');
        });

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(1);

      expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(1);
    });

    it('should not update roles dids - no dids were returned', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);
      identityServiceMock.identityReady = jest
        .fn()
        .mockImplementation(async () => true);
      channelServiceMock.getChannelOrThrow = jest
        .fn()
        .mockImplementation(() => ({
          internalChannelMock,
          conditions: {
            ...internalChannelMock.conditions,
            topics: [],
          },
        }));

      dsbApiServiceMock.getDIDsFromRoles = jest
        .fn()
        .mockImplementation(async () => []);

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(1);

      expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(1);

      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledTimes(1);
      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledWith(
        internalChannelMock.conditions.roles,
        'ANY'
      );

      expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(0);
    });

    it('should update roles dids - no dids were returned', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);
      identityServiceMock.identityReady = jest
        .fn()
        .mockImplementation(async () => true);
      channelServiceMock.getChannelOrThrow = jest
        .fn()
        .mockImplementation(() => ({
          ...internalChannelMock,
          conditions: {
            ...internalChannelMock.conditions,
            topics: [],
          },
        }));

      dsbApiServiceMock.getDIDsFromRoles = jest
        .fn()
        .mockImplementation(async () => [
          'did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5',
        ]);

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(1);

      expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(1);

      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledTimes(1);
      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledWith(
        internalChannelMock.conditions.roles,
        'ANY'
      );

      expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(1);
      expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledWith(
        internalChannelMock.fqcn,
        ['did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5']
      );
    });

    it('should not update topic versions - no topics were returned', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);
      identityServiceMock.identityReady = jest
        .fn()
        .mockImplementation(async () => true);
      channelServiceMock.getChannelOrThrow = jest
        .fn()
        .mockImplementation(() => ({
          ...internalChannelMock,
          conditions: {
            ...internalChannelMock.conditions,
            topics: [
              {
                topicName: 'test',
                owner: 'test',
                topicId: '622fed6e4258501225095045',
              },
            ],
          },
        }));

      dsbApiServiceMock.getDIDsFromRoles = jest
        .fn()
        .mockImplementation(async () => []);

      dsbApiServiceMock.getTopicVersions = jest
        .fn()
        .mockImplementation(async () => ({
          count: 0,
          limit: 0,
          page: 1,
          records: [],
        }));

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(1);

      expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(1);

      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledTimes(1);
      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledWith(
        internalChannelMock.conditions.roles,
        'ANY'
      );

      expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(0);

      expect(dsbApiServiceMock.getTopicVersions).toBeCalledTimes(1);
      expect(dsbApiServiceMock.getTopicVersions).toBeCalledWith(
        '622fed6e4258501225095045'
      );

      expect(channelServiceMock.updateChannelTopic).toBeCalledTimes(0);
    });

    it('should update topic versions', async () => {
      iamServiceMock.isInitialized = jest.fn().mockImplementation(() => true);
      identityServiceMock.identityReady = jest
        .fn()
        .mockImplementation(async () => true);
      channelServiceMock.getChannelOrThrow = jest
        .fn()
        .mockImplementation(() => ({
          ...internalChannelMock,
          conditions: {
            ...internalChannelMock.conditions,
            topics: [
              {
                topicName: 'test',
                owner: 'test',
                topicId: '622fed6e4258501225095045',
              },
            ],
          },
        }));

      dsbApiServiceMock.getDIDsFromRoles = jest
        .fn()
        .mockImplementation(async () => []);

      dsbApiServiceMock.getTopicVersions = jest
        .fn()
        .mockImplementation(async () => topicVersionsSuccessResponse);

      await channelDidCacheService.refreshChannelCache(
        internalChannelMock.fqcn
      );

      expect(identityServiceMock.identityReady).toBeCalledTimes(1);

      expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(1);

      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledTimes(1);
      expect(dsbApiServiceMock.getDIDsFromRoles).toBeCalledWith(
        internalChannelMock.conditions.roles,
        'ANY'
      );

      expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(0);

      expect(dsbApiServiceMock.getTopicVersions).toBeCalledTimes(1);
      expect(dsbApiServiceMock.getTopicVersions).toBeCalledWith(
        '622fed6e4258501225095045'
      );

      expect(channelServiceMock.updateChannelTopic).toBeCalledTimes(1);
    });
  });
});
