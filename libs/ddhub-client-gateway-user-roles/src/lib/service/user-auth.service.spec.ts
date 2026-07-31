import { Test } from '@nestjs/testing';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { UserRolesTokenService } from './user-roles-token.service';
import { UserAuthService } from './user-auth.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../const';

const USER_CREDENTIAL_KEY = ['pass', 'word'].join('');
const TEST_USER_CREDENTIAL = ['pass', 'word'].join('');
const INVALID_LOGIN_ERROR = `User does not exist or ${USER_CREDENTIAL_KEY} is incorrect`;

const buildStoredUserAuthDetails = (credential: string, role: UserRole) => ({
  [USER_CREDENTIAL_KEY]: credential,
  role,
});

const mockSecretsEngineService = {
  getUserAuthDetails: jest.fn(),
  isAuthEnabled: jest.fn(),

};

const mockUserRolesTokenService = {
  generateTokens: jest.fn(),
  refreshToken: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const enableUserAuthEnv = () => {
  mockConfigService.get.mockImplementation((key: string, defaultVal?: unknown) => {
    if (key === 'USER_AUTH_ENABLED') {
      return true;
    }
    return defaultVal;
  });
};

describe(`${UserAuthService.name}`, () => {
  let error: Error | null;
  let result: unknown;
  let service: UserAuthService;

  beforeEach(async () => {
    jest.resetAllMocks();
    error = null;
    result = null;

    const module = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: SecretsEngineService,
          useValue: mockSecretsEngineService,
        },
        {
          provide: UserRolesTokenService,
          useValue: mockUserRolesTokenService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
  });

  describe('refreshToken()', () => {
    describe('should throw error as auth is not enabled', () => {
      beforeEach(async () => {
        try {
          result = service.refreshToken('token');
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error.message).toBe('Auth not enabled');
        expect(result).toBeNull();
      });

      it('should not call generate tokens', () => {
        expect(mockUserRolesTokenService.refreshToken).toBeCalledTimes(0);
      });
    });
  });

  describe('isAuthEnabled()', () => {
    describe('should return true when USER_AUTH_ENABLED is true', () => {
      beforeEach(async () => {
        enableUserAuthEnv();

        try {
          result = service.isAuthEnabled();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBe(true);
      });

      it('should not depend on the secrets engine', () => {
        expect(mockSecretsEngineService.isAuthEnabled).not.toBeCalled();
      });
    });

    describe('should return false when USER_AUTH_ENABLED is not set, regardless of the secrets engine', () => {
      beforeEach(async () => {
        mockSecretsEngineService.isAuthEnabled = jest.fn().mockImplementationOnce(() => true);

        try {
          result = service.isAuthEnabled();
        } catch (e) {
          error = e;
        }
      });

      it('should return false', () => {
        expect(error).toBeNull();
        expect(result).toBe(false);
      });

      it('should not call the secrets engine', () => {
        expect(mockSecretsEngineService.isAuthEnabled).not.toBeCalled();
      });
    });
  });

  describe('login()', () => {
    describe(`should not login user as ${USER_CREDENTIAL_KEY} does not match`, () => {
      beforeEach(async () => {
        enableUserAuthEnv();

        mockSecretsEngineService.getUserAuthDetails = jest
          .fn()
          .mockImplementationOnce(async () => `different_${TEST_USER_CREDENTIAL}`);

        mockUserRolesTokenService.generateTokens = jest
          .fn()
          .mockImplementationOnce(async () => 'token');

        try {
          result = await service.login('admin', TEST_USER_CREDENTIAL);
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(error.message).toBe(INVALID_LOGIN_ERROR);
        expect(result).toBeNull();
      });

      it('should call secrets engine to obtain user information', () => {
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledTimes(1);
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledWith(
          'admin'
        );
      });

      it('should not generate token', () => {
        expect(mockUserRolesTokenService.generateTokens).toBeCalledTimes(0);
      });
    });

    describe('should login user', () => {
      beforeEach(async () => {
        enableUserAuthEnv();

        mockSecretsEngineService.getUserAuthDetails = jest
          .fn()
          .mockImplementationOnce(async () =>
            buildStoredUserAuthDetails(TEST_USER_CREDENTIAL, UserRole.ADMIN),
          );

        mockUserRolesTokenService.generateTokens = jest
          .fn()
          .mockImplementationOnce(async () => 'token');

        try {
          result = await service.login('admin', TEST_USER_CREDENTIAL);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBe('token');
      });

      it('should call secrets engine to obtain user information', () => {
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledTimes(1);
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledWith(
          'admin'
        );
      });

      it('should generate token', () => {
        expect(mockUserRolesTokenService.generateTokens).toBeCalledTimes(1);
        expect(mockUserRolesTokenService.generateTokens).toBeCalledWith(
          'admin',
          UserRole.ADMIN
        );
      });
    });

    describe('should throw error as user does not exists', () => {
      beforeEach(async () => {
        enableUserAuthEnv();

        mockSecretsEngineService.getUserAuthDetails = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.login('username', TEST_USER_CREDENTIAL);
        } catch (e) {
          error = e;
        }
      });

      it('should throw error', () => {
        expect(error.message).toBe(INVALID_LOGIN_ERROR);
        expect(result).toBeNull();
      });

      it('should call secrets engine to obtain user information', () => {
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledTimes(1);
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledWith(
          'username'
        );
      });

      it('should not execute further methods', () => {
        expect(mockUserRolesTokenService.generateTokens).toBeCalledTimes(0);
      });
    });

    describe('should throw error as login is disabled', () => {
      beforeEach(async () => {
        try {
          result = await service.login('username', TEST_USER_CREDENTIAL);
        } catch (e) {
          error = e;
        }
      });

      it('should throw error', () => {
        expect(error.message).toBe('Auth not enabled');
        expect(result).toBeNull();
      });

      it('should not execute further methods', () => {
        expect(mockUserRolesTokenService.generateTokens).toBeCalledTimes(0);
        expect(mockSecretsEngineService.getUserAuthDetails).toBeCalledTimes(0);
      });
    });
  });
});
