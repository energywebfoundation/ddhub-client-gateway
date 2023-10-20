import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from '../service/user-auth.service';
import { UserGuard } from './user.guard';
import { UserTokenData } from '../service';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

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
  switchToHttp: () => ({
    getRequest: () => ({
      headers: {},
    }),
  }),
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

        mockReflector.get = jest.fn().mockImplementationOnce(() => {
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
  });
});
