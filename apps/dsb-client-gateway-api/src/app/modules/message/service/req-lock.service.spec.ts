import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ReqLockService } from './req-lock.service';
import {
  ReqLockEntity,
  ReqLockWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import moment from 'moment';
import { ReqLockExistsException } from '../exceptions/req-lock-exists.exception';

const mockReqLockWrapper = {
  repository: {
    delete: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
  },
};

const mockConfigService = {
  get: jest.fn(),
};

describe(`${ReqLockService.name}`, () => {
  let reqLockService: ReqLockService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReqLockService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: ReqLockWrapperRepository,
          useValue: mockReqLockWrapper,
        },
      ],
    }).compile();

    reqLockService = module.get<ReqLockService>(ReqLockService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(reqLockService).toBeInstanceOf(ReqLockService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('clearLock()', () => {
    let error: Error | null;

    beforeEach(() => {
      error = null;
    });

    describe('should clear lock', () => {
      const clientId = 'testClientId';
      const fqcn = 'testFqcn';

      beforeEach(async () => {
        mockReqLockWrapper.repository.delete = jest
          .fn()
          .mockResolvedValue(undefined);

        try {
          await reqLockService.clearLock(clientId, fqcn);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call repository to delete lock', async () => {
        expect(mockReqLockWrapper.repository.delete).toHaveBeenCalledWith({
          fqcn,
          clientId,
        });
      });
    });
  });

  describe('attemptLock()', () => {
    let error: Error | null;

    beforeEach(() => {
      error = null;
    });

    describe('should throw error as lock is up', () => {
      const clientId = 'testClientId';
      const fqcn = 'testFqcn';

      beforeEach(async () => {
        mockReqLockWrapper.repository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => undefined);

        try {
          await reqLockService.attemptLock(clientId, fqcn);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should create lock', () => {
        expect(mockReqLockWrapper.repository.insert).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.insert).toBeCalledWith({
          fqcn: fqcn,
          clientId: clientId,
        });
      });

      it('should try to find existing lock', () => {
        expect(mockReqLockWrapper.repository.findOne).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.findOne).toBeCalledWith({
          where: {
            clientId: clientId,
            fqcn: fqcn,
          },
        });
      });

      it('should throw error on another lock attempt', async () => {
        try {
          await reqLockService.attemptLock(clientId, fqcn);

          expect(true).toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(ReqLockExistsException);
        }
      });
    });

    describe('should create lock as one has expired', () => {
      const clientId = 'testClientId';
      const fqcn = 'testFqcn';

      beforeEach(async () => {
        mockConfigService.get = jest
          .fn()
          .mockImplementationOnce(async () => 60);

        mockReqLockWrapper.repository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fqcn: fqcn,
              clientId: clientId,
              createdDate: moment().subtract(1, 'second').toDate(),
              updatedDate: moment().subtract(1, 'second').toDate(),
            } as ReqLockEntity;
          });

        try {
          await reqLockService.attemptLock(clientId, fqcn);
        } catch (e) {
          error = e;
        }
      });

      it('should not throw error', () => {
        expect(error).toBeNull();
      });

      it('should delete lock', () => {
        expect(mockReqLockWrapper.repository.delete).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.delete).toBeCalledWith({
          fqcn: fqcn,
          clientId: clientId,
        });
      });

      it('should create lock', () => {
        expect(mockReqLockWrapper.repository.insert).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.insert).toBeCalledWith({
          fqcn: fqcn,
          clientId: clientId,
        });
      });

      it('should return all locks', () => {
        const locks = reqLockService.getLocks();

        expect(locks).toStrictEqual({
          'testClientId:testFqcn': expect.any(Date),
        });
      });

      it('should try to find existing lock', () => {
        expect(mockReqLockWrapper.repository.findOne).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.findOne).toBeCalledWith({
          where: {
            clientId: clientId,
            fqcn: fqcn,
          },
        });
      });
    });

    describe('should successfuly attempt a lock', () => {
      const clientId = 'testClientId';
      const fqcn = 'testFqcn';

      beforeEach(async () => {
        mockReqLockWrapper.repository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => undefined);

        try {
          await reqLockService.attemptLock(clientId, fqcn);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should create lock', () => {
        expect(mockReqLockWrapper.repository.insert).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.insert).toBeCalledWith({
          fqcn: fqcn,
          clientId: clientId,
        });
      });

      it('should try to find existing lock', () => {
        expect(mockReqLockWrapper.repository.findOne).toBeCalledTimes(1);
        expect(mockReqLockWrapper.repository.findOne).toBeCalledWith({
          where: {
            clientId: clientId,
            fqcn: fqcn,
          },
        });
      });
    });
  });
});
