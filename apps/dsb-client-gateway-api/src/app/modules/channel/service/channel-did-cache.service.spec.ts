import { ChannelDidCacheService } from './channel-did-cache.service';
import { Test } from '@nestjs/testing';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import {
  DdhubDidService,
  DdhubTopicsService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  ChannelEntity,
  ChannelType,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ChannelService } from './channel.service';

const iamServiceMock = {
  isInitialized: jest.fn(),
};

const channelServiceMock = {
  getChannelOrThrow: jest.fn(),
  updateChannelQualifiedDids: jest.fn(),
};

const identityServiceMock = {
  identityReady: jest.fn(),
};

const ddhubTopicServiceMock = {
  getTopicVersions: jest.fn(),
};

const ddhubDidServiceMock = {
  getDIDsFromRoles: jest.fn(),
};

const topicRepositoryWrapperMock = {
  save: jest.fn(),
};

describe(`${ChannelDidCacheService.name}`, () => {
  let service: ChannelDidCacheService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const app = await Test.createTestingModule({
      providers: [
        ChannelDidCacheService,
        {
          provide: IamService,
          useValue: iamServiceMock,
        },
        {
          provide: ChannelService,
          useValue: channelServiceMock,
        },
        {
          provide: IdentityService,
          useValue: identityServiceMock,
        },
        {
          provide: DdhubTopicsService,
          useValue: ddhubTopicServiceMock,
        },
        {
          provide: DdhubDidService,
          useValue: ddhubDidServiceMock,
        },
        {
          provide: TopicRepositoryWrapper,
          useValue: topicRepositoryWrapperMock,
        },
      ],
    }).compile();

    service = app.get<ChannelDidCacheService>(ChannelDidCacheService);
  });

  describe('refreshChannelCache()', () => {
    describe('should refresh dids', () => {
      let error: Error | null;
      let result: unknown | null;

      beforeEach(async () => {
        error = null;
        result = null;

        try {
          iamServiceMock.isInitialized = jest
            .fn()
            .mockImplementationOnce(() => true);

          identityServiceMock.identityReady = jest
            .fn()
            .mockImplementationOnce(async () => true);

          channelServiceMock.getChannelOrThrow = jest
            .fn()
            .mockImplementationOnce(async () => {
              return {
                fqcn: 'fqcn',
                type: ChannelType.SUB,
                messageForms: false,
                conditions: {
                  topics: [],
                  responseTopics: [],
                  dids: ['did1'],
                  qualifiedDids: [],
                  roles: ['role1'],
                },
              } as ChannelEntity;
            });

          ddhubDidServiceMock.getDIDsFromRoles = jest
            .fn()
            .mockImplementationOnce(async () => {
              return ['did2'];
            });

          result = await service.refreshChannelCache('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should check for iam readiness', () => {
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should check for identity readiness', () => {
        expect(identityServiceMock.identityReady).toBeCalledTimes(1);
      });

      it('should call for get channel', () => {
        expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(1);
        expect(channelServiceMock.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should receive dids from ddhub', () => {
        expect(ddhubDidServiceMock.getDIDsFromRoles).toBeCalledTimes(1);
        expect(ddhubDidServiceMock.getDIDsFromRoles).toBeCalledWith(
          ['role1'],
          'ANY',
          {
            retries: 1,
          }
        );
      });

      it('should update qualified dids', () => {
        expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(
          1
        );
        expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledWith(
          'fqcn',
          ['did2', 'did1']
        );
      });
    });

    describe('should not refresh as identity is not ready', () => {
      let error: Error | null;
      let result: unknown | null;

      beforeEach(async () => {
        error = null;
        result = null;

        try {
          iamServiceMock.isInitialized = jest
            .fn()
            .mockImplementationOnce(() => true);
          identityServiceMock.identityReady = jest
            .fn()
            .mockImplementationOnce(async () => false);

          result = await service.refreshChannelCache('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
        expect(identityServiceMock.identityReady).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(0);
        expect(ddhubDidServiceMock.getDIDsFromRoles).toBeCalledTimes(0);
        expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(
          0
        );
      });
    });

    describe('should not refresh as iam is not initialized', () => {
      let error: Error | null;
      let result: unknown | null;

      beforeEach(async () => {
        error = null;
        result = null;

        try {
          iamServiceMock.isInitialized = jest
            .fn()
            .mockImplementationOnce(() => false);

          result = await service.refreshChannelCache('fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(iamServiceMock.isInitialized).toBeCalledTimes(1);
      });

      it('should not call further methods', () => {
        expect(identityServiceMock.identityReady).toBeCalledTimes(0);
        expect(channelServiceMock.getChannelOrThrow).toBeCalledTimes(0);
        expect(ddhubDidServiceMock.getDIDsFromRoles).toBeCalledTimes(0);
        expect(channelServiceMock.updateChannelQualifiedDids).toBeCalledTimes(
          0
        );
      });
    });
  });
});
