import { SecretsCacheProxyService } from './secrets-cache-proxy.service';
import { UserRole } from '../../secrets-engine.interface';

describe('SecretsCacheProxyService users', () => {
  // Simulates an engine whose listing lags behind writes, like AWS ListSecrets.
  const buildEngine = (listed: { username: string; password: string; role: string }[]) => ({
    setUserPassword: jest.fn().mockResolvedValue(undefined),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    getAllUsers: jest.fn().mockImplementation(async () => [...listed]),
  });

  it('should list a new user even when the engine listing does not show it yet', async () => {
    const engine = buildEngine([{ username: 'existing', password: 'p', role: UserRole.ADMIN }]);
    const proxy = new SecretsCacheProxyService(engine as any);

    await proxy.setUserPassword('operator01', 'pass', UserRole.MESSAGING);

    expect(engine.setUserPassword).toBeCalledWith('operator01', 'pass', UserRole.MESSAGING);
    expect(await proxy.getAllUsers()).toEqual([
      { username: 'existing', password: 'p', role: UserRole.ADMIN },
      { username: 'operator01', password: 'pass', role: UserRole.MESSAGING },
    ]);
    expect(await proxy.getUserAuthDetails('operator01')).toEqual({
      username: 'operator01',
      password: 'pass',
      role: UserRole.MESSAGING,
    });
  });

  it('should drop a deleted user even when the engine listing still shows it', async () => {
    const engine = buildEngine([{ username: 'operator01', password: 'pass', role: UserRole.ADMIN }]);
    const proxy = new SecretsCacheProxyService(engine as any);
    await proxy.refreshUsersData();

    await proxy.deleteUser('operator01');

    expect(await proxy.getAllUsers()).toEqual([]);
    expect(await proxy.getUserAuthDetails('operator01')).toBeNull();
  });

  it('should leave the cache unchanged when the write fails', async () => {
    const engine = buildEngine([]);
    engine.setUserPassword.mockRejectedValue(new Error('AccessDenied'));
    const proxy = new SecretsCacheProxyService(engine as any);

    await expect(proxy.setUserPassword('operator01', 'pass', UserRole.ADMIN)).rejects.toThrow('AccessDenied');
    expect(await proxy.getAllUsers()).toEqual([]);
  });
});
