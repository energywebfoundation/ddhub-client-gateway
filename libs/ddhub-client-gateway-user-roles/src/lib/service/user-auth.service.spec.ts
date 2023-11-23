import { Test } from '@nestjs/testing';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { UserRolesTokenService } from './user-roles-token.service';
import { UserAuthService } from './user-auth.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../const';

const mockSecretsEngineService = {
  getUserAuthDetails: jest.fn(),
};

const mockUserRolesTokenService = {
  generateTokens: jest.fn(),
  refreshToken: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
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
        mockConfigService.get = jest.fn().mockImplementationOnce(() => false);

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

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith(
          'USER_AUTH_ENABLED',
          false
        );
      });
    });
  });

  describe('isAuthEnabled()', () => {
    describe('should return true', () => {
      beforeEach(async () => {
        mockConfigService.get = jest.fn().mockImplementationOnce(() => true);

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

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith(
          'USER_AUTH_ENABLED',
          false
        );
      });
    });
  });

  describe('login()', () => {
    describe('should not login user as password does not match', () => {
      beforeEach(async () => {
        mockConfigService.get = jest.fn().mockImplementationOnce(() => true);

        mockSecretsEngineService.getUserAuthDetails = jest
          .fn()
          .mockImplementationOnce(async () => 'different_password');

        mockUserRolesTokenService.generateTokens = jest
          .fn()
          .mockImplementationOnce(async () => 'token');

        try {
          result = await service.login('admin', 'password');
        } catch (e) {
          error = e;
        }
      });

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith(
          'USER_AUTH_ENABLED',
          false
        );
      });

      it('should not execute', () => {
        expect(error.message).toBe(
          'User does not exist or password is incorrect'
        );
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
        mockConfigService.get = jest.fn().mockImplementationOnce(() => true);

        mockSecretsEngineService.getUserAuthDetails = jest
          .fn()
          .mockImplementationOnce(async () => ({
            password: 'password',
            role: UserRole.ADMIN,
          }));

        mockUserRolesTokenService.generateTokens = jest
          .fn()
          .mockImplementationOnce(async () => 'token');

        try {
          result = await service.login('admin', 'password');
        } catch (e) {
          error = e;
        }
      });

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith(
          'USER_AUTH_ENABLED',
          false
        );
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
        mockConfigService.get = jest.fn().mockImplementationOnce(() => true);

        mockSecretsEngineService.getUserAuthDetails = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.login('username', 'password');
        } catch (e) {
          error = e;
        }
      });

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith(
          'USER_AUTH_ENABLED',
          false
        );
      });

      it('should throw error', () => {
        expect(error.message).toBe(
          'User does not exist or password is incorrect'
        );
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
        mockConfigService.get = jest.fn().mockImplementationOnce(() => false);

        try {
          result = await service.login('username', 'password');
        } catch (e) {
          error = e;
        }
      });

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith(
          'USER_AUTH_ENABLED',
          false
        );
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
