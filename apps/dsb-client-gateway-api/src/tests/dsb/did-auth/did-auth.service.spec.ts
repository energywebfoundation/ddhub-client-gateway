import { DidAuthService } from '../../../app/modules/dsb-client/module/did-auth/service/did-auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DidAuthApiService } from '../../../app/modules/dsb-client/module/did-auth/service/did-auth-api.service';
import { EthersService } from '../../../app/modules/utils/service/ethers.service';

const mockedDidAuthApiService = {
  refreshToken: jest.fn(),
  login: jest.fn(),
  logger: null,
  httpService: null,
};

const mockedEthersService = {
  createProof: jest.fn(),
  getBalance: jest.fn(),
  getWalletFromPrivateKey: jest.fn(),
  validatePrivateKey: jest.fn(),
  createPrivateKey: jest.fn(),
};

describe('DidAuthService (SPEC)', () => {
  let didAuthService: DidAuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [DidAuthService, DidAuthApiService, EthersService],
    })
      .overrideProvider(DidAuthApiService)
      .useValue(mockedDidAuthApiService)
      .overrideProvider(EthersService)
      .useValue(mockedEthersService)
      .compile();

    didAuthService = app.get<DidAuthService>(DidAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('should return access token in case of success', async () => {
      mockedEthersService.createProof = jest
        .fn()
        .mockImplementation(async () => 'proof');
      mockedDidAuthApiService.login = jest.fn().mockImplementation(async () => {
        return {
          access_token: 'AT',
          refresh_token: 'RT',
          expires_in: 60,
          type: 'Bearer',
        };
      });

      await didAuthService.login('VALID', 'valid');

      expect(mockedDidAuthApiService.login).toBeCalledTimes(1);
      expect(mockedEthersService.createProof).toBeCalledTimes(1);

      const token = didAuthService.getToken();

      expect(token).toEqual('AT');
    });
  });
});
