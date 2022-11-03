import {
  ReqLocksCache,
  ReqLockService,
} from '../../app/modules/message/service/req-lock.service';
import {
  ReqLockEntity,
  ReqLockWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';

const reqLockWrapperMock = {
  repository: {
    findOne: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  },
};

const configServiceMock = {
  get: jest.fn(),
};

const clientId: string = 'clientId';
const fqcn: string = 'fqcn';

const createEmptyLock = async (
  service: ReqLockService
): Promise<ReqLocksCache> => {
  await service.attemptLock(clientId, fqcn);

  const cachedLocks = service.getLocks();

  expect(reqLockWrapperMock.repository.findOne).toBeCalledTimes(1);
  expect(reqLockWrapperMock.repository.findOne).toBeCalledWith({
    where: {
      fqcn,
      clientId,
    },
  });

  expect(reqLockWrapperMock.repository.insert).toBeCalledTimes(1);
  expect(reqLockWrapperMock.repository.insert).toBeCalledWith({
    fqcn,
    clientId,
  });

  expect(cachedLocks[`${clientId}:${fqcn}`]).toBeDefined();

  return cachedLocks;
};

describe('ReqLockService (SPEC)', () => {
  let reqLockService: ReqLockService;

  beforeEach(() => {
    reqLockService = new ReqLockService(
      reqLockWrapperMock as unknown as ReqLockWrapperRepository,
      configServiceMock as unknown as ConfigService
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('clearLock', () => {
    it('should delete lock', async () => {
      reqLockWrapperMock.repository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      await createEmptyLock(reqLockService);

      expect(reqLockWrapperMock.repository.delete).toBeCalledTimes(0);

      await reqLockService.clearLock(clientId, fqcn);

      const cachedLocks = reqLockService.getLocks();

      expect(cachedLocks[`${clientId}:${fqcn}`]).toBe(undefined);
    });
  });

  describe('attemptLock', () => {
    it('should delete outdated lock', async () => {
      configServiceMock.get = jest.fn().mockImplementationOnce(() => 30);

      reqLockWrapperMock.repository.findOne = jest
        .fn()
        .mockImplementation(async () => {
          const entity = new ReqLockEntity();

          entity.fqcn = fqcn;
          entity.clientId = clientId;
          entity.updatedDate = moment().subtract(60, 'seconds').toDate();
          entity.createdDate = moment().toDate();

          return entity;
        });

      const cachedLocks = await createEmptyLock(reqLockService);
      expect(reqLockWrapperMock.repository.delete).toBeCalledTimes(1);

      expect(cachedLocks[`${clientId}:${fqcn}`]).toBeDefined();
    });

    it('should create lock', async () => {
      reqLockWrapperMock.repository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      await createEmptyLock(reqLockService);

      expect(reqLockWrapperMock.repository.delete).toBeCalledTimes(0);
    });
  });
});
