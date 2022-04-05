import { Module } from '@nestjs/common';
import { KeysService } from './service/keys.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysController } from './keys.controller';
import { KeysRepository } from './repository/keys.repository';
import { IdentityModule } from '../identity/identity.module';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DsbClientGatewayStorageModule, SecretsEngineModule, IdentityModule],
  providers: [KeysService, KeysRepository],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
