import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import {
  CacheClient,
  ClaimsService,
  DidRegistry,
  RegistrationTypes,
  SignerService,
} from 'iam-client-lib';
import { IamFactoryService } from './iam-factory.service';
import { ConfigService } from '@nestjs/config';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';

const mockCacheClient = {
  getClaimsBySubject: jest.fn(),
  getDIDsForRole: jest.fn(),
  getClaimsByRequester: jest.fn(),
  getAppDefinition: jest.fn(),
};

const mockClaimsService = {
  getUserClaims: jest.fn(),
  getClaimById: jest.fn(),
  publishPublicClaim: jest.fn(),
  requestClaim: jest.fn(),
  createClaimRequest: jest.fn(),
};

const mockDidRegistry = {
  updateDocument: jest.fn(),
  getDidDocument: jest.fn(),
  decodeJWTToken: jest.fn(),
};

const mockSignerService = {
  did: 'mockedDid',
};

const mockIamFactoryService = {
  initialize: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockRetryConfigService = {
  config: {
    retries: 1,
  },
};

describe('IamService', () => {
  let service: IamService;
  let error: Error | null;
  let result: unknown | null;

  beforeEach(async () => {
    jest.resetAllMocks();
    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        {
          provide: IamFactoryService,
          useValue: mockIamFactoryService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RetryConfigService,
          useValue: mockRetryConfigService,
        },
      ],
    }).compile();

    service = module.get<IamService>(IamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClaimsWithStatus()', () => {
    describe('should return claims', () => {
      beforeEach(async () => {
        service['claimsService'] =
          mockClaimsService as unknown as ClaimsService;

        service['signerService'] =
          mockSignerService as unknown as SignerService;

        service['cacheClient'] = mockCacheClient as unknown as CacheClient;

        mockClaimsService.getUserClaims = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                claimType: 'user.roles.global.apps.ddhub.energyweb.auth.ewc',
                namespace: 'energyweb',
              },
            ];
          });

        mockCacheClient.getClaimsBySubject = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                claimType: 'user.roles.global.apps.ddhub.energyweb.auth.ewc',
                namespace: 'energyweb',
                isAccepted: true,
              },
              {
                claimType:
                  'marketing.roles.global.apps.ddhub.energyweb.auth.ewc',
                namespace: 'namespace2',
                isRejected: true,
                isAccepted: false,
              },
            ];
          });

        try {
          result = await service.getClaimsWithStatus();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should store correct claims', () => {
        const castedResult = result as any;

        expect(castedResult.length).toBe(2);

        expect(castedResult[0]).toStrictEqual({
          namespace: 'user.roles.global.apps.ddhub.energyweb.auth.ewc',
          status: RoleStatus.APPROVED,
          syncedToDidDoc: true,
        });

        expect(castedResult[1]).toStrictEqual({
          namespace: 'marketing.roles.global.apps.ddhub.energyweb.auth.ewc',
          status: RoleStatus.REJECTED,
          syncedToDidDoc: false,
        });
      });

      it('should call get claims by subject', () => {
        expect(mockCacheClient.getClaimsBySubject).toBeCalledTimes(1);
        expect(mockCacheClient.getClaimsBySubject).toBeCalledWith('mockedDid');
      });

      it('should obtain synchronized claims', () => {
        expect(mockClaimsService.getUserClaims).toBeCalledTimes(1);
        expect(mockClaimsService.getUserClaims).toBeCalledWith({
          did: 'mockedDid',
        });
      });
    });
  });

  describe('getApplicationsByOwnerAndRole()', () => {
    describe('should return applications', () => {
      beforeEach(async () => {
        service['cacheClient'] = mockCacheClient as unknown as CacheClient;

        mockCacheClient.getAppDefinition = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              appName: 'appName',
            };
          });

        mockCacheClient.getClaimsByRequester = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                claimType: 'user.roles.global.apps.ddhub.energyweb.auth.ewc',
                namespace: 'energyweb',
              },
              {
                claimType:
                  'marketing.roles.global.apps.ddhub.energyweb.auth.ewc',
                namespace: 'namespace2',
              },
            ];
          });

        try {
          result = await service.getApplicationsByOwnerAndRole(
            'user.roles',
            'ownerDid',
          );
        } catch (e) {
          error = e;
        }
      });

      it('should get claims by requester', () => {
        expect(mockCacheClient.getClaimsByRequester).toBeCalledTimes(1);
        expect(mockCacheClient.getClaimsByRequester).toBeCalledWith(
          'ownerDid',
          {
            isAccepted: true,
          },
        );
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should contain application', () => {
        expect(result).toStrictEqual([
          {
            appName: 'appName',
            namespace: 'energyweb',
          },
        ]);
      });

      it('should not call further methods', () => {
        expect(mockCacheClient.getAppDefinition).toBeCalledTimes(1);
        expect(mockCacheClient.getAppDefinition).toBeCalledWith('energyweb');
      });
    });

    describe('should throw error if cacheClient return errors', () => {
      beforeEach(async () => {
        service['cacheClient'] = mockCacheClient as unknown as CacheClient;

        mockCacheClient.getClaimsByRequester = jest
          .fn()
          .mockImplementationOnce(async () => {
            throw new Error('error');
          });

        try {
          result = await service.getApplicationsByOwnerAndRole(
            'roleName',
            'ownerDid',
          );
        } catch (e) {
          error = e;
        }
      });

      it('should get claims by requester', () => {
        expect(mockCacheClient.getClaimsByRequester).toBeCalledTimes(1);
        expect(mockCacheClient.getClaimsByRequester).toBeCalledWith(
          'ownerDid',
          {
            isAccepted: true,
          },
        );
      });

      it('should not execute', () => {
        expect(error.message).toBe('error');
        expect(result).toBeNull();
      });

      it('should not call further methods', () => {
        expect(mockCacheClient.getAppDefinition).toBeCalledTimes(0);
      });
    });
  });

  describe('decodeJWTToken()', () => {
    describe('should decode JWT token', () => {
      beforeEach(async () => {
        service['didRegistry'] = mockDidRegistry as unknown as DidRegistry;

        try {
          await service.decodeJWTToken('token');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should decode jwt token', () => {
        expect(mockDidRegistry.decodeJWTToken).toBeCalledTimes(1);
        expect(mockDidRegistry.decodeJWTToken).toBeCalledWith({
          token: 'token',
        });
      });
    });
  });

  describe('publishPublicClaim()', () => {
    describe('should publish claim', () => {
      beforeEach(async () => {
        service['claimsService'] =
          mockClaimsService as unknown as ClaimsService;

        try {
          await service.publishPublicClaim('token');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should publish claim', () => {
        expect(mockClaimsService.publishPublicClaim).toBeCalledTimes(1);
        expect(mockClaimsService.publishPublicClaim).toBeCalledWith({
          claim: {
            token: 'token',
          },
        });
      });
    });
  });

  describe('requestClaim()', () => {
    describe('should request claim', () => {
      beforeEach(async () => {
        service['claimsService'] =
          mockClaimsService as unknown as ClaimsService;

        try {
          await service.requestClaim('claim');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should create claim request', () => {
        expect(mockClaimsService.createClaimRequest).toBeCalledTimes(1);
        expect(mockClaimsService.createClaimRequest).toBeCalledWith({
          claim: {
            claimType: 'claim',
            claimTypeVersion: 1,
            fields: [],
          },
          registrationTypes: [
            RegistrationTypes.OnChain,
            RegistrationTypes.OffChain,
          ],
        });
      });
    });
  });

  describe('getDid()', () => {
    describe('should retry error and return did', () => {
      beforeEach(async () => {
        service['signerService'] =
          mockSignerService as unknown as SignerService;
        service['didRegistry'] = mockDidRegistry as unknown as DidRegistry;

        mockDidRegistry.getDidDocument = jest
          .fn()
          .mockImplementationOnce(async () => {
            const error = new Error() as unknown as any;

            error.code = 'ETIMEDOUT';

            throw error;
          })
          .mockImplementationOnce(async () => {
            return {
              did: 'did',
            };
          });

        try {
          result = await service.getDid();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        // expect(error).toBeInstanceOf(Error); https://github.com/jestjs/jest/issues/2549
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should contain did', () => {
        expect(result).toStrictEqual({
          did: 'did',
        });
      });

      it('should call did registry', () => {
        expect(mockDidRegistry.getDidDocument).toBeCalledTimes(2);

        expect(mockDidRegistry.getDidDocument).toHaveBeenNthCalledWith(1, {
          did: 'mockedDid',
          includeClaims: false,
        });

        expect(mockDidRegistry.getDidDocument).toHaveBeenNthCalledWith(2, {
          did: 'mockedDid',
          includeClaims: false,
        });
      });
    });

    describe('should not retry non-retriable error', () => {
      beforeEach(async () => {
        service['signerService'] =
          mockSignerService as unknown as SignerService;
        service['didRegistry'] = mockDidRegistry as unknown as DidRegistry;

        mockDidRegistry.getDidDocument = jest
          .fn()
          .mockImplementationOnce(async () => {
            const error = new Error() as unknown as any;

            error.code = 'NON_RETRIABLE';

            throw error;
          });

        try {
          result = await service.getDid();
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        // expect(error).toBeInstanceOf(Error); https://github.com/jestjs/jest/issues/2549
        expect(result).toBeNull();
        expect(error).toBeNull();
      });

      it('result should be empty', () => {
        expect(result).toBeNull();
      });

      it('should call did registry', () => {
        expect(mockDidRegistry.getDidDocument).toBeCalledTimes(1);
        expect(mockDidRegistry.getDidDocument).toBeCalledWith({
          did: 'mockedDid',
          includeClaims: false,
        });
      });
    });

    describe('should return did document', () => {
      beforeEach(async () => {
        service['signerService'] =
          mockSignerService as unknown as SignerService;
        service['didRegistry'] = mockDidRegistry as unknown as DidRegistry;

        mockDidRegistry.getDidDocument = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              did: 'did',
            };
          }); // it's not real did document - we don't need to mock it here

        try {
          result = await service.getDid();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should contain did', () => {
        expect(result).toStrictEqual({
          did: 'did',
        });
      });

      it('should call did registry', () => {
        expect(mockDidRegistry.getDidDocument).toBeCalledTimes(1);
        expect(mockDidRegistry.getDidDocument).toBeCalledWith({
          did: 'mockedDid',
          includeClaims: false,
        });
      });
    });
  });

  describe('getDIDAddress()', () => {
    describe('should return null for not initialized signer service', () => {
      beforeEach(async () => {
        service['signerService'] = null;

        try {
          result = await service.getDIDAddress();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeNull();
      });
    });

    describe('should return mocked did address', () => {
      beforeEach(async () => {
        service['signerService'] =
          mockSignerService as unknown as SignerService;

        try {
          result = await service.getDIDAddress();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBe('mockedDid');
      });
    });
  });
});
