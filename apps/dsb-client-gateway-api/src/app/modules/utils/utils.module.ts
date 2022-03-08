import { Global, Module } from '@nestjs/common';
import { EthersService } from './service/ethers.service';
import { ConfigService } from '@nestjs/config';
import { providers } from 'ethers';
import { AuthService } from './service/auth.service';
import { DigestGuard } from './guards/digest.guard';

@Global()
@Module({
  providers: [
    {
      provide: EthersService,
      useFactory: (configService: ConfigService) => {
        const provider = new providers.JsonRpcProvider(
          configService.get<string>(
            'RPC_URL',
            'https://volta-rpc.energyweb.org/'
          )
        );

        return new EthersService(provider);
      },
      inject: [ConfigService],
    },
    AuthService,
    DigestGuard,
  ],
  exports: [EthersService, AuthService],
})
export class UtilsModule {}
