import { Module } from '@nestjs/common';
import { Bip39Service, EthersService, RetryConfigService } from './services';
import { ConfigService } from '@nestjs/config';
import { providers } from 'ethers';
import { DirectoryCreatedService } from './services/directory-created.service';

@Module({
  controllers: [],
  providers: [
    RetryConfigService,
    {
      provide: EthersService,
      useFactory: (configService: ConfigService) => {
        const provider = new providers.JsonRpcProvider(
          configService.get<string>(
            'RPC_URL',
            'https://volta-rpc.energyweb.org/',
          ),
        );

        return new EthersService(provider);
      },
      inject: [ConfigService],
    },
    DirectoryCreatedService,
    Bip39Service,
  ],
  exports: [RetryConfigService, EthersService, Bip39Service],
})
export class DdhubClientGatewayUtilsModule {}
