import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CacheClient,
  ClaimsService,
  DidRegistry,
  initWithPrivateKeySigner,
  setCacheConfig,
  setChainConfig,
  SignerService,
} from 'iam-client-lib';
import { Span } from 'nestjs-otel';

@Injectable()
export class IamFactoryService {
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

    setChainConfig(73799, {
      claimManagerAddress: configService.get<string>(
        'CLAIM_MANAGER_ADDRESS',
        '0x5339adE9332A604A1c957B9bC1C6eee0Bcf7a031'
      ),
    });

    setCacheConfig(chainId, {
      url: cacheServerUrl,
    });

    try {
      const { cacheClient, connectToDidRegistry } =
        await connectToCacheServer();

      const { claimsService, didRegistry } = await connectToDidRegistry();

      await didRegistry.init();
      await claimsService.init();

      return { cacheClient, claimsService, didRegistry, signerService };
    } catch (e) {
      console.error(e);
    }
  }
}
