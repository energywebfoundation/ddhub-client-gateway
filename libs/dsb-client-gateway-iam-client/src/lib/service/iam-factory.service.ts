import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CacheClient,
  ClaimsService,
  DidRegistry,
  ILogger,
  initWithPrivateKeySigner,
  LogLevel,
  setCacheConfig,
  setChainConfig,
  setLogger,
  SignerService,
} from 'iam-client-lib';
import { Span } from 'nestjs-otel';

@Injectable()
export class IamFactoryService {
  protected readonly logger = new Logger(IamFactoryService.name);

  @Span('iam_initialize')
  public async initialize(
    privateKey: string,
    configService: ConfigService
  ): Promise<{
    cacheClient: CacheClient;
    didRegistry: DidRegistry;
    claimsService: ClaimsService;
    signerService: SignerService;
  }> {
    const chainId = configService.get<number>('CHAIN_ID', 73799);
    const rpcUrl = configService.get<string>(
      'RPC_URL',
      'https://volta-rpc.energyweb.org/'
    );
    const cacheServerUrl = configService.get<string>(
      'CACHE_SERVER_URL',
      'https://identitycache-dev.energyweb.org/v1'
    );

    const { connectToCacheServer, signerService } =
      await initWithPrivateKeySigner(privateKey, rpcUrl);

    setLogger(this.getLogger());

    setChainConfig(chainId, {
      claimManagerAddress: configService.get<string>(
        'CLAIM_MANAGER_ADDRESS',
        '0x5339adE9332A604A1c957B9bC1C6eee0Bcf7a031'
      ),
    });

    setCacheConfig(chainId, {
      url: cacheServerUrl,
    });

    try {
      this.logger.log('connecting to cache server');

      const { cacheClient, connectToDidRegistry } =
        await connectToCacheServer();

      this.logger.log(
        'connected to iam cache server, connecting to did registry'
      );

      const { claimsService, didRegistry } = await connectToDidRegistry({
        privateKey,
        host: ''
      });

      await didRegistry.init();
      await claimsService.init();

      this.logger.log('connected to did registry, iam setup finalized');

      return { cacheClient, claimsService, didRegistry, signerService };
    } catch (e) {
      this.logger.error('error during setup iam', e);
    }
  }

  protected getLogger(): ILogger {
    return {
      log: (message) => {
        this.logger.log(message);
      },
      error: (message) => {
        this.logger.error(message);
      },
      info: (message) => {
        this.logger.log(message);
      },
      warn: (message) => {
        this.logger.warn(message);
      },
      debug: (message) => {
        this.logger.debug(message);
      },
      _logLevel: LogLevel.debug,
    } as unknown as ILogger;
  }
}
