import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

const mockConfigService = {
  get: jest.fn(),
};

const mockSecretsEngineService = {
  isAuthEnabled: jest.fn(),
  getUserAuthDetails: jest.fn(),
};

const enableUserAuthEnv = () => {
  mockConfigService.get.mockImplementation((key: string, defaultVal?: unknown) => {
    if (key === 'USER_AUTH_ENABLED') {
      return true;
    }
    return defaultVal;
  });
};

describe(`${AuthService.name}`, () => {
  let service: AuthService;
  let error: Error | null;
  let result: unknown;

  beforeEach(async () => {
    jest.resetAllMocks();
    error = null;
    result = null;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SecretsEngineService,
          useValue: mockSecretsEngineService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('isAuthorized()', () => {
    describe('should not authorize user if credentials are invalid', () => {
      beforeEach(async () => {
        enableUserAuthEnv();
        mockSecretsEngineService.getUserAuthDetails.mockResolvedValue({
          username: 'test',
          password: 'invalidPassword',
          role: 'admin',
        });

        try {
          result = await service.isAuthorized('dGVzdDplbmVyZ3l3ZWI=');
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should return false', () => {
        expect(result).toBeFalsy();
      });

      it('should look up the decoded username', () => {
        expect(
          mockSecretsEngineService.getUserAuthDetails
        ).toHaveBeenCalledWith('test');
      });
    });

    describe('should authorize user if credentials are valid', () => {
      beforeEach(async () => {
        enableUserAuthEnv();
        mockSecretsEngineService.getUserAuthDetails.mockResolvedValue({
          username: 'test',
          password: 'energyweb',
          role: 'admin',
        });

        try {
          result = await service.isAuthorized('dGVzdDplbmVyZ3l3ZWI=');
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should return true', () => {
        expect(result).toBeTruthy();
      });
    });

    describe('should authorize user if USER_AUTH_ENABLED is false', () => {
      beforeEach(async () => {
        try {
          result = await service.isAuthorized('token');
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should return true', () => {
        expect(result).toBeTruthy();
      });

      it('should not look up user details', () => {
        expect(mockSecretsEngineService.getUserAuthDetails).not.toBeCalled();
      });
    });
  });

  describe('isAuthEnabled()', () => {
    it('should return true when USER_AUTH_ENABLED is true', () => {
      enableUserAuthEnv();

      result = service.isAuthEnabled();

      expect(result).toBe(true);
    });

    it('should return false when USER_AUTH_ENABLED is false, regardless of the secrets engine', () => {
      mockSecretsEngineService.isAuthEnabled.mockReturnValue(true);

      result = service.isAuthEnabled();

      expect(result).toBe(false);
      expect(mockSecretsEngineService.isAuthEnabled).not.toBeCalled();
    });

    it('should not depend on the secrets engine when USER_AUTH_ENABLED is true', () => {
      enableUserAuthEnv();
      mockSecretsEngineService.isAuthEnabled.mockReturnValue(false);

      result = service.isAuthEnabled();

      expect(result).toBe(true);
      expect(mockSecretsEngineService.isAuthEnabled).not.toBeCalled();
    });
  });
});
