import { Test, TestingModule } from '@nestjs/testing';
import { DidAuthService } from './did-auth.service';
import { DidAuthApiService } from './did-auth-api.service';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthResponse } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';

const mockDidAuthApiService = {
  login: jest.fn(),
  refreshToken: jest.fn(),
};

const mockEthersService = {
  createProof: jest.fn(),
};

describe('DidAuthService', () => {
  let service: DidAuthService;
  let error: Error | null;
  let result: unknown;

  beforeEach(async () => {
    jest.clearAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DidAuthService,
        {
          provide: DidAuthApiService,
          useValue: mockDidAuthApiService,
        },
        {
          provide: EthersService,
          useValue: mockEthersService,
        },
      ],
    }).compile();

    service = module.get<DidAuthService>(DidAuthService);

    service['refreshToken'] = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {
    describe('should refresh login with refresh token', () => {
      beforeEach(async () => {
        service['refreshToken'] = 'rt';

        mockDidAuthApiService.refreshToken = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              access_token: 'newAt',
              type: 'Bearer',
              expires_in: 3600,
              refresh_token: 'newRt',
            } as DidAuthResponse;
          });

        try {
          await service.login('pk', 'did');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(service.getToken()).toBeDefined();
      });

      it('should not call did login', () => {
        expect(mockDidAuthApiService.login).toBeCalledTimes(0);
      });

      it('should call refresh did token', () => {
        expect(mockDidAuthApiService.refreshToken).toBeCalledTimes(1);
        expect(mockDidAuthApiService.refreshToken).toBeCalledWith('rt');
      });

      it('getToken should return valid token', () => {
        expect(service.getToken()).toBe('newAt');
      });
    });

    describe('should login without refresh token', () => {
      beforeEach(async () => {
        mockEthersService.createProof = jest
          .fn()
          .mockImplementationOnce(async () => 'proof');

        mockDidAuthApiService.login = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              access_token: 'at',
              type: 'Bearer',
              expires_in: 3600,
              refresh_token: 'rt',
            } as DidAuthResponse;
          });

        try {
          await service.login('pk', 'did');
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(service.getToken()).toBeDefined();
      });

      it('should call did auth api service', () => {
        expect(mockDidAuthApiService.login).toBeCalledTimes(1);
        expect(mockDidAuthApiService.login).toBeCalledWith('proof');
      });

      it('getToken should return valid token', () => {
        expect(service.getToken()).toBe('at');
      });
    });
  });
});
