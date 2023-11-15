import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from './certificate.service';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { ConfigService } from '@nestjs/config';
import {
  Events,
  EventsService,
} from '@dsb-client-gateway/ddhub-client-gateway-events';

const mockSecretsEngineService = {
  setCertificateDetails: jest.fn(),
};

const mockTlsAgentService = {
  get: jest.fn(),
  create: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockEventsService = {
  triggerEvent: jest.fn(),
  emitEvent: jest.fn(),
};

describe('CertificateService', () => {
  let service: CertificateService;
  let error: Error | null;
  let result: unknown;

  beforeEach(async () => {
    jest.resetAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificateService,
        {
          provide: SecretsEngineService,
          useValue: mockSecretsEngineService,
        },
        {
          provide: TlsAgentService,
          useValue: mockTlsAgentService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    service = module.get<CertificateService>(CertificateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isMTLSConfigured()', () => {
    describe('should return true for disabled mTLS', () => {
      beforeEach(async () => {
        mockConfigService.get = jest.fn().mockImplementationOnce(() => false);

        try {
          result = await service.isMTLSConfigured();
        } catch (e) {
          error = e;
        }
      });

      it('should call config service to obtain mTLS information', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith('MTLS_ENABLED');
      });

      it('should not call tls agent service', () => {
        expect(mockTlsAgentService.get).toBeCalledTimes(0);
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeTruthy();
      });
    });

    describe('should return true for created agent', () => {
      beforeEach(async () => {
        mockConfigService.get = jest.fn().mockImplementationOnce(() => true);

        mockTlsAgentService.get = jest.fn().mockImplementationOnce(() => {
          return {
            id: 1, // we don't need to return anything special here as it's not validated in code
          };
        });

        try {
          result = await service.isMTLSConfigured();
        } catch (e) {
          error = e;
        }
      });

      it('should call config service to obtain mTLS information', () => {
        expect(mockConfigService.get).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledWith('MTLS_ENABLED');
      });

      it('should call tls agent service', () => {
        expect(mockTlsAgentService.get).toBeCalledTimes(1);
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeTruthy();
      });
    });
  });

  describe('configureMTLS()', () => {
    describe('should create agent', () => {
      beforeEach(async () => {
        mockTlsAgentService.create = jest
          .fn()
          .mockImplementationOnce(async () => null);

        mockTlsAgentService.get = jest.fn().mockImplementationOnce(async () => {
          return {
            id: 1, // we don't need to return anything special here as it's not validated in code
          };
        });

        try {
          result = await service.configureMTLS();
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toBeTruthy();
      });

      it('should call create agent', () => {
        expect(mockTlsAgentService.create).toBeCalledTimes(1);
      });

      it('should call get agent after creation', () => {
        expect(mockTlsAgentService.get).toBeCalledTimes(1);
      });
    });
  });

  describe('save()', () => {
    describe('should save certificate', () => {
      beforeEach(async () => {
        try {
          const payload = [
            {
              buffer: Buffer.from('1'),
            },
            {
              buffer: Buffer.from('2'),
            },
            {
              buffer: Buffer.from('3'),
            },
          ] as Express.Multer.File[];

          await service.save(payload[0], payload[1], payload[2]);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should store certificate information in secrets engine', () => {
        expect(mockSecretsEngineService.setCertificateDetails).toBeCalledTimes(
          1
        );
        expect(mockSecretsEngineService.setCertificateDetails).toBeCalledWith({
          caCertificate: '3',
          certificate: '1',
          privateKey: '2',
        });
      });

      it('should emit events', () => {
        expect(mockEventsService.triggerEvent).toBeCalledTimes(1);
        expect(mockEventsService.triggerEvent).toBeCalledWith(
          Events.CERTIFICATE_CHANGED
        );

        expect(mockEventsService.emitEvent).toBeCalledTimes(1);
        expect(mockEventsService.emitEvent).toBeCalledWith(
          Events.CERTIFICATE_CHANGED
        );
      });
    });
  });
});
