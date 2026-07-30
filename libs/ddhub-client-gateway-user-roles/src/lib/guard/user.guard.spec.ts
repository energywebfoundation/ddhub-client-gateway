import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from '../service/user-auth.service';
import { UserGuard } from './user.guard';
import { UserTokenData } from '../service';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { PinoLogger } from 'nestjs-pino';

const mockUserAuthService = {
  isAuthEnabled: jest.fn(),
  verifyToken: jest.fn(),
};

const mockReflector = {
  get: jest.fn(),
};

const mockContext = {
  getHandler: jest.fn(),
  switchToHttp: () => ({
    getRequest: () => ({
      headers: {
        authorization: 'Bearer mockToken',
      },
    }),
  }),
};

const mockContextWithoutHeader = {
  getHandler: jest.fn(),
  switchToHttp: () => ({
    getRequest: () => ({
      headers: {},
    }),
  }),
};

const buildApiKeyContext = (role: string | undefined) => ({
  getHandler: jest.fn(),
  switchToHttp: () => ({
    getRequest: () => ({
      headers: {},
      user: {
        authType: 'api-key',
        role,
      },
    }),
  }),
});

const mockPinoLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  assign: jest.fn(),
};


describe('UserGuard', () => {
  let guard: UserGuard;
  let error: Error | null;
  let result: unknown | null;

  beforeEach(async () => {
    jest.clearAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGuard,
        {
          provide: UserAuthService,
          useValue: mockUserAuthService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: PinoLogger,
          useValue: mockPinoLogger,
        },
      ],
    }).compile();

    guard = module.get<UserGuard>(UserGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate()', () => {
    describe('should bypass as auth is disabled', () => {
      beforeEach(async () => {
        mockUserAuthService.isAuthEnabled = jest
          .fn()
          .mockImplementationOnce(() => false);

        try {
          result = await guard.canActivate(mockContext as any);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeTruthy();
      });

      it('should call user service', () => {
        expect(mockUserAuthService.isAuthEnabled).toBeCalledTimes(1);
      });
    });

    describe('should return false as header token is not present', () => {
      beforeEach(async () => {
        mockUserAuthService.isAuthEnabled = jest
          .fn()
          .mockImplementationOnce(() => true);

        try {
          result = await guard.canActivate(mockContextWithoutHeader as any);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeFalsy();
      });

      it('should call user service', () => {
        expect(mockUserAuthService.isAuthEnabled).toBeCalledTimes(1);
      });
    });

    describe('should return false as JWT is invalid', () => {
      beforeEach(async () => {
        mockUserAuthService.isAuthEnabled = jest
          .fn()
          .mockImplementationOnce(() => true);

        mockUserAuthService.verifyToken = jest
          .fn()
          .mockImplementationOnce(() => {
            throw new Error('invalid-token');
          });

        try {
          result = await guard.canActivate(mockContext as any);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeFalsy();
      });

      it('should call user service', () => {
        expect(mockUserAuthService.isAuthEnabled).toBeCalledTimes(1);
      });

      it('should call verify token', () => {
        expect(mockUserAuthService.verifyToken).toBeCalledTimes(1);
        expect(mockUserAuthService.verifyToken).toBeCalledWith('mockToken');
      });
    });

    describe('should return true', () => {
      beforeEach(async () => {
        mockUserAuthService.isAuthEnabled = jest
          .fn()
          .mockImplementationOnce(() => true);

        mockUserAuthService.verifyToken = jest
          .fn()
          .mockImplementationOnce(() => {
            return {
              type: 'access',
              accountType: UserRole.MESSAGING,
              username: 'str',
            } as UserTokenData;
          });

        mockReflector.get = jest.fn().mockImplementation((param) => {
          if (param === 'EXCLUDED_ROUTE') {
            return false;
          }

          return [UserRole.MESSAGING];
        });

        try {
          result = await guard.canActivate(mockContext as any);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeTruthy();
      });

      it('should call user service', () => {
        expect(mockUserAuthService.isAuthEnabled).toBeCalledTimes(1);
      });

      it('should call verify token', () => {
        expect(mockUserAuthService.verifyToken).toBeCalledTimes(1);
        expect(mockUserAuthService.verifyToken).toBeCalledWith('mockToken');
      });
    });

    describe('api-key auth', () => {
      beforeEach(() => {
        mockUserAuthService.isAuthEnabled = jest
          .fn()
          .mockImplementation(() => true);
      });

      it('should allow a messaging-role api-key on a route that allows messaging', async () => {
        mockReflector.get = jest.fn().mockImplementation((param) => {
          if (param === 'EXCLUDED_ROUTE') {
            return false;
          }
          return [UserRole.MESSAGING];
        });

        const result = await guard.canActivate(
          buildApiKeyContext(UserRole.MESSAGING) as any
        );
        expect(result).toBeTruthy();
      });

      it('should deny a messaging-role api-key on a route that does not allow messaging', async () => {
        mockReflector.get = jest.fn().mockImplementation((param) => {
          if (param === 'EXCLUDED_ROUTE') {
            return false;
          }
          return [UserRole.ADMIN, UserRole.SUPERADMIN];
        });

        const result = await guard.canActivate(
          buildApiKeyContext(UserRole.MESSAGING) as any
        );
        expect(result).toBeFalsy();
      });

      it('should deny a messaging-role api-key on a route with no @Roles metadata', async () => {
        mockReflector.get = jest.fn().mockImplementation(() => undefined);

        const result = await guard.canActivate(
          buildApiKeyContext(UserRole.MESSAGING) as any
        );
        expect(result).toBeFalsy();
      });

      it('should allow an admin-role api-key on any route', async () => {
        mockReflector.get = jest.fn().mockImplementation(() => undefined);

        const result = await guard.canActivate(
          buildApiKeyContext(UserRole.ADMIN) as any
        );
        expect(result).toBeTruthy();
      });

      it('should allow a superadmin-role api-key on any route', async () => {
        mockReflector.get = jest.fn().mockImplementation(() => undefined);

        const result = await guard.canActivate(
          buildApiKeyContext(UserRole.SUPERADMIN) as any
        );
        expect(result).toBeTruthy();
      });
    });
  });
});
