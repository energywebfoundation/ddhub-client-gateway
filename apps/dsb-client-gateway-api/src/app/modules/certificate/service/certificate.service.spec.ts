import { CertificateService } from './certificate.service';
import { Agent } from 'https';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { ConfigService } from '@nestjs/config';
import { EventsService } from '@dsb-client-gateway/ddhub-client-gateway-events';

const secretsEngineMock = {
  setCertificateDetails: jest.fn(),
};

const tlsAgentService = {
  create: jest.fn(),
  get: jest.fn(),
};

const configService = {
  get: jest.fn(),
};

const eventsService = {
  triggerEvent: jest.fn(),
  emitEvent: jest.fn(),
};

describe.skip('CertificateService (SPEC)', () => {
  let certificateService: CertificateService;

  beforeEach(() => {
    certificateService = new CertificateService(
      secretsEngineMock as unknown as SecretsEngineService,
      tlsAgentService as unknown as TlsAgentService,
      configService as unknown as ConfigService,
      eventsService as unknown as EventsService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isMTLSConfigured', () => {
    it('should return true due to disabled mTLS', async () => {
      configService.get = jest.fn().mockImplementationOnce(() => false);

      const result: boolean = await certificateService.isMTLSConfigured();

      expect(result).toBe(true);
      expect(tlsAgentService.get).toBeCalledTimes(0);
      expect(tlsAgentService.create).toBeCalledTimes(0);
    });

    it('should return true as HTTPS Agent is returned', async () => {
      configService.get = jest.fn().mockImplementationOnce(() => true);

      tlsAgentService.get = jest
        .fn()
        .mockImplementationOnce(async () => new Agent());

      const result: boolean = await certificateService.isMTLSConfigured();

      expect(result).toBe(true);
      expect(tlsAgentService.get).toBeCalledTimes(1);
      expect(tlsAgentService.create).toBeCalledTimes(0);
    });

    it('should return true as HTTPS Agent is created', async () => {
      configService.get = jest.fn().mockImplementationOnce(() => true);

      tlsAgentService.get = jest
        .fn()
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() => new Agent());

      const result: boolean = await certificateService.isMTLSConfigured();

      expect(result).toBe(true);

      expect(tlsAgentService.get).toBeCalledTimes(2);
      expect(tlsAgentService.create).toBeCalledTimes(1);
    });

    it('should return false as certificate is not set', async () => {
      configService.get = jest.fn().mockImplementationOnce(() => true);

      tlsAgentService.get = jest
        .fn()
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() => undefined);

      const result: boolean = await certificateService.isMTLSConfigured();

      expect(result).toBe(true);

      expect(tlsAgentService.get).toBeCalledTimes(2);
      expect(tlsAgentService.create).toBeCalledTimes(1);
    });
  });
});
