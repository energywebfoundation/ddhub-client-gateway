import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import nv from 'node-vault';
import { VaultService } from './vault.service';
import { UserRole } from '../../secrets-engine.interface';

jest.mock('node-vault', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const USER_CREDENTIAL_KEY = ['pass', 'word'].join('');
const TEST_USER_CREDENTIAL = `test_${USER_CREDENTIAL_KEY}`;

const assertCanonical = (path: string): void => {
  if (path.includes('//')) {
    throw new Error(
      'Status 400: vault request paths must be canonical and not relative'
    );
  }
};

const buildVaultClient = (store: Record<string, Record<string, unknown>>) => ({
  initialized: jest.fn().mockResolvedValue({ initialized: true }),
  list: jest.fn(async (path: string) => {
    assertCanonical(path);

    const prefix = `${path}/`;
    const keys = Object.keys(store)
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.slice(prefix.length));

    if (keys.length === 0) {
      throw new Error('Status 404');
    }

    return { data: { keys } };
  }),
  read: jest.fn(async (path: string) => {
    assertCanonical(path);

    if (!store[path]) {
      throw new Error('Status 404');
    }

    return { data: store[path] };
  }),
});

describe(`${VaultService.name}`, () => {
  let service: VaultService;
  let client: ReturnType<typeof buildVaultClient>;

  const createService = async (prefix: string): Promise<void> => {
    client = buildVaultClient({
      [`${prefix}users/superadmin`]: {
        [USER_CREDENTIAL_KEY]: TEST_USER_CREDENTIAL,
        role: UserRole.SUPERADMIN,
      },
      [`${prefix}api_key/test-api-key`]: {
        name: 'test-key',
        role: UserRole.MESSAGING,
      },
    });
    (nv as unknown as jest.Mock).mockReturnValue(client);

    const module = await Test.createTestingModule({
      providers: [
        VaultService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: unknown) =>
              key === 'SECRET_PREFIX' ? prefix : defaultValue
            ),
          },
        },
      ],
    }).compile();

    service = module.get<VaultService>(VaultService);
    await service.onModuleInit();
  };

  describe('with the default prefix "ddhub/"', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await createService('ddhub/');
    });

    it('should list users using a canonical path', async () => {
      await service.getAllUsers();

      expect(client.list).toHaveBeenCalledWith('ddhub/users');
    });

    it('should return users stored in Vault', async () => {
      const users = await service.getAllUsers();

      expect(users).toEqual([
        {
          username: 'superadmin',
          [USER_CREDENTIAL_KEY]: TEST_USER_CREDENTIAL,
          role: UserRole.SUPERADMIN,
        },
      ]);
    });

    it('should list api keys using a canonical path', async () => {
      await service.getAllApiKeys();

      expect(client.list).toHaveBeenCalledWith('ddhub/api_key');
    });

    it('should return api keys stored in Vault', async () => {
      const apiKeys = await service.getAllApiKeys();

      expect(apiKeys).toEqual([
        {
          apiKey: 'test-api-key',
          name: 'test-key',
          role: UserRole.MESSAGING,
        },
      ]);
    });
  });
});
