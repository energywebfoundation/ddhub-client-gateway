import { ApplicationsService } from './applications.service';
import { Test } from '@nestjs/testing';
import {
  ApplicationEntity,
  ApplicationWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

const mockApplicationsRepository = {
  repository: {
    find: jest.fn(),
  },
};

describe(`${ApplicationsService.name}`, () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const app = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: ApplicationWrapperRepository,
          useValue: mockApplicationsRepository,
        },
      ],
    }).compile();

    service = app.get<ApplicationsService>(ApplicationsService);
  });

  describe('getApplicationsByNamespace()', () => {
    describe('should return applications', () => {
      let error: Error | null;
      let result: ApplicationEntity[] | null;

      beforeEach(async () => {
        result = null;
        error = null;

        try {
          result = await service.getApplicationsByNamespace('namespace');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call repository', () => {
        expect(mockApplicationsRepository.repository.find).toBeCalledTimes(1);
        expect(mockApplicationsRepository.repository.find).toBeCalledWith({
          where: {
            namespace: 'namespace',
          },
        });
      });
    });
  });

  describe('getApplications()', () => {
    describe('should return applications filtered by role', () => {
      let error: Error | null;
      let result: ApplicationEntity[] | null;

      const expectedRole = 'roleName';

      beforeEach(async () => {
        result = null;
        error = null;

        try {
          mockApplicationsRepository.repository.find = jest
            .fn()
            .mockImplementationOnce(async () => {
              return [
                {
                  description: 'description',
                  appName: 'appName',
                  createdDate: new Date(),
                  logoUrl: 'logoUrl',
                  roles: [expectedRole],
                  namespace: 'namespace',
                  topicsCount: 1,
                  updatedDate: new Date(),
                  websiteUrl: 'websiteUrl',
                },
                {
                  description: 'description',
                  appName: 'appName',
                  createdDate: new Date(),
                  logoUrl: 'logoUrl',
                  roles: ['differentRole'],
                  namespace: 'namespace',
                  topicsCount: 1,
                  updatedDate: new Date(),
                  websiteUrl: 'websiteUrl',
                },
              ] as ApplicationEntity[];
            });

          result = await service.getApplications('roleName');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should call applications repository', () => {
        expect(mockApplicationsRepository.repository.find).toBeCalledTimes(1);
      });

      it('should return expected application', () => {
        expect(result.length).toBe(1);
        expect(result[0].roles.includes(expectedRole)).toBeTruthy();
      });
    });
  });
});
