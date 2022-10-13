import fs from 'fs';
import { VersionService } from '../lib/service/version.service';

const configServiceMock = {
  get: jest.fn(),
};

jest.mock('fs');

describe('VersionService (SPEC)', () => {
  let versionService: VersionService;

  beforeEach(() => {
    versionService = new VersionService(configServiceMock as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loadVersion', () => {
    it('should not load version as version file path is not defined', () => {
      configServiceMock.get = jest.fn().mockImplementationOnce(() => undefined);

      versionService.loadVersion();

      const result = versionService.getVersion();

      expect(result).toBe('NOT_DETECTED');

      expect(fs.existsSync).toBeCalledTimes(0);
      expect(fs.readFileSync).toBeCalledTimes(0);
    });

    it('should not load version as version file is missing', () => {
      const path = './version';

      configServiceMock.get = jest
        .fn()
        .mockImplementationOnce(() => './version');

      fs.existsSync = jest.fn().mockImplementationOnce(() => false);
      versionService.loadVersion();

      const result = versionService.getVersion();

      expect(result).toBe('NOT_DETECTED');

      expect(fs.existsSync).toBeCalledTimes(1);
      expect(fs.existsSync).toBeCalledWith(path);

      expect(fs.readFileSync).toBeCalledTimes(0);
    });

    it('should load version', () => {
      const path = './version';
      const data = 'test-version';

      configServiceMock.get = jest.fn().mockImplementationOnce(() => path);

      fs.existsSync = jest.fn().mockImplementationOnce(() => true);
      fs.readFileSync = jest.fn().mockImplementationOnce(() => {
        return Buffer.from(data);
      });

      versionService.loadVersion();

      const result = versionService.getVersion();

      expect(result).toBe(data);

      expect(fs.existsSync).toBeCalledTimes(1);
      expect(fs.existsSync).toBeCalledWith(path);

      expect(fs.readFileSync).toBeCalledTimes(1);
      expect(fs.readFileSync).toBeCalledWith(path);
    });
  });
});
