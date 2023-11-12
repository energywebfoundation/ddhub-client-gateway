import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

const mockConfigService = {
  get: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('isAuthorized()', () => {
    describe('should not authorize user if credentials are invalid', () => {
      beforeEach(async () => {
        mockConfigService.get = jest
          .fn()
          .mockImplementation((param: string) => {
            if (param === 'USERNAME') {
              return 'invalid';
            } else {
              return 'invalidPassword';
            }
          });

        try {
          result = service.isAuthorized('dGVzdDplbmVyZ3l3ZWI=');
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
    });

    describe('should authorize user if credentials are valid', () => {
      beforeEach(async () => {
        mockConfigService.get = jest
          .fn()
          .mockImplementation((param: string) => {
            if (param === 'USERNAME') {
              return 'test';
            } else {
              return 'energyweb';
            }
          });

        try {
          result = service.isAuthorized('dGVzdDplbmVyZ3l3ZWI=');
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

    describe('should authorize user if auth is not enabled', () => {
      beforeEach(async () => {
        mockConfigService.get = jest.fn().mockImplementation(() => {
          return null;
        });

        try {
          result = service.isAuthorized('token');
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

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(4);

        expect(mockConfigService.get).toHaveBeenNthCalledWith(1, 'USERNAME');
        expect(mockConfigService.get).toHaveBeenNthCalledWith(2, 'PASSWORD');

        expect(mockConfigService.get).toHaveBeenNthCalledWith(3, 'USERNAME');
        expect(mockConfigService.get).toHaveBeenNthCalledWith(4, 'PASSWORD');
      });
    });
  });

  describe('isAuthEnabled()', () => {
    describe('auth should be disabled as password and username is not set', () => {
      beforeEach(async () => {
        mockConfigService.get = jest.fn().mockImplementation(() => {
          return null;
        });

        try {
          result = service.isAuthEnabled();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should be true', () => {
        expect(result).toBeFalsy();
      });

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(2);

        expect(mockConfigService.get).toHaveBeenNthCalledWith(1, 'USERNAME');
        expect(mockConfigService.get).toHaveBeenNthCalledWith(2, 'PASSWORD');
      });
    });

    describe('auth should be enabled', () => {
      beforeEach(async () => {
        mockConfigService.get = jest
          .fn()
          .mockImplementation((param: string) => {
            if (param === 'USERNAME') {
              return 'username';
            } else {
              return 'password';
            }
          });

        try {
          result = service.isAuthEnabled();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should be true', () => {
        expect(result).toBeTruthy();
      });

      it('should call config service', () => {
        expect(mockConfigService.get).toBeCalledTimes(2);

        expect(mockConfigService.get).toHaveBeenNthCalledWith(1, 'USERNAME');
        expect(mockConfigService.get).toHaveBeenNthCalledWith(2, 'PASSWORD');
      });
    });
  });
});
