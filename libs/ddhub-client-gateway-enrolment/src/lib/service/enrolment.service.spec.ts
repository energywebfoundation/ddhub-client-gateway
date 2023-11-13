import { Test, TestingModule } from '@nestjs/testing';
import { EnrolmentService } from './enrolment.service';
import {
  Claim,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ConfigService } from '@nestjs/config';
import { RoleListenerService } from './role-listener.service';
import { EnrolmentWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';

const iamServiceMock = {
  getDIDAddress: jest.fn(),
  getClaimsWithStatus: jest.fn(),
};

const configServiceMock = {
  get: jest.fn(),
};

const roleListenerServiceMock = {
  startListening: jest.fn(),
  stopListening: jest.fn(),
};

const enrolmentWrapperRepositoryMock = {
  enrolmentRepository: {
    findOne: jest.fn(),
    clear: jest.fn(),
    createOne: jest.fn(),
  },
};

describe('EnrolmentService', () => {
  let service: EnrolmentService;
  let error: Error | null;
  let result: unknown;

  beforeEach(async () => {
    jest.clearAllMocks();
    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrolmentService,
        {
          provide: IamService,
          useValue: iamServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: RoleListenerService,
          useValue: roleListenerServiceMock,
        },
        {
          provide: EnrolmentWrapperRepository,
          useValue: enrolmentWrapperRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<EnrolmentService>(EnrolmentService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(EnrolmentService);
  });

  describe('deleteEnrolment()', () => {
    describe('should delete enrolment', () => {
      beforeEach(async () => {
        try {
          await service.deleteEnrolment();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should delete enrolment', () => {
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.clear
        ).toBeCalledTimes(1);
      });
    });
  });

  describe('stopListening()', () => {
    describe('should stop listening', () => {
      beforeEach(async () => {
        try {
          await roleListenerServiceMock.stopListening();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should stop listening', () => {
        expect(roleListenerServiceMock.stopListening).toBeCalledTimes(1);
      });
    });
  });

  describe('startListening()', () => {
    describe('should start listening', () => {
      beforeEach(async () => {
        try {
          await roleListenerServiceMock.startListening();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should start listening', () => {
        expect(roleListenerServiceMock.startListening).toBeCalledTimes(1);
      });
    });
  });

  describe('generateEnrolment()', () => {
    describe('should generate new enrolment', () => {
      beforeEach(async () => {
        configServiceMock.get = jest
          .fn()
          .mockImplementationOnce(() => 'ddhub.apps.energyweb.iam.ewc');

        iamServiceMock.getDIDAddress = jest
          .fn()
          .mockImplementation(() => 'did');

        iamServiceMock.getClaimsWithStatus = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                status: RoleStatus.APPROVED,
                namespace: 'namespace',
                syncedToDidDoc: true,
              },
            ] as Claim[];
          });

        try {
          result = await service.generateEnrolment();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should store enrolment', () => {
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.createOne
        ).toBeCalledTimes(1);
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.createOne
        ).toBeCalledWith({
          did: 'did',
          roles: [
            {
              namespace: 'namespace',
              status: RoleStatus.SYNCED,
              required: false,
            },
            {
              namespace: 'user.roles.ddhub.apps.energyweb.iam.ewc',
              status: RoleStatus.NOT_ENROLLED,
              required: true,
            },
          ],
        });
      });

      it('result should be enrolment entity', () => {
        expect(result).toEqual({
          did: 'did',
          roles: [
            {
              namespace: 'namespace',
              status: RoleStatus.SYNCED,
              required: false,
            },
            {
              namespace: 'user.roles.ddhub.apps.energyweb.iam.ewc',
              status: RoleStatus.NOT_ENROLLED,
              required: true,
            },
          ],
        });
      });
    });
  });

  describe('getFromCache()', () => {
    describe('should return enrolment', () => {
      beforeEach(async () => {
        iamServiceMock.getDIDAddress = jest
          .fn()
          .mockImplementationOnce(() => 'did');

        enrolmentWrapperRepositoryMock.enrolmentRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return null;
          });

        try {
          result = await service.getFromCache();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should call iam service', () => {
        expect(iamServiceMock.getDIDAddress).toBeCalledTimes(1);
      });

      it('should attempt to get enrolment', () => {
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.findOne
        ).toBeCalledTimes(1);
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.findOne
        ).toBeCalledWith({
          where: {
            did: 'did',
          },
        });
      });

      it('result should contain enrolment', () => {
        expect(result).toEqual(null);
      });
    });

    describe('should return enrolment', () => {
      beforeEach(async () => {
        iamServiceMock.getDIDAddress = jest
          .fn()
          .mockImplementationOnce(() => 'did');

        enrolmentWrapperRepositoryMock.enrolmentRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => {
            return null;
          });

        try {
          result = await service.getFromCache();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should call iam service', () => {
        expect(iamServiceMock.getDIDAddress).toBeCalledTimes(1);
      });

      it('should attempt to get enrolment', () => {
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.findOne
        ).toBeCalledTimes(1);
        expect(
          enrolmentWrapperRepositoryMock.enrolmentRepository.findOne
        ).toBeCalledWith({
          where: {
            did: 'did',
          },
        });
      });

      it('result should contain enrolment', () => {
        expect(result).toEqual(null);
      });
    });
  });

  describe('getRequiredRoles()', () => {
    describe('should return required roles', () => {
      beforeEach(async () => {
        configServiceMock.get = jest
          .fn()
          .mockImplementationOnce(() => 'ddhub.apps.energyweb.iam.ewc');

        try {
          result = service.getRequiredRoles();
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('result should contain required roles', () => {
        expect(result).toEqual(['user.roles.ddhub.apps.energyweb.iam.ewc']);
      });

      it('should fetch parent namespace', () => {
        expect(configServiceMock.get).toBeCalledTimes(1);
        expect(configServiceMock.get).toBeCalledWith(
          'PARENT_NAMESPACE',
          'ddhub.apps.energyweb.iam.ewc'
        );
      });
    });
  });
});
