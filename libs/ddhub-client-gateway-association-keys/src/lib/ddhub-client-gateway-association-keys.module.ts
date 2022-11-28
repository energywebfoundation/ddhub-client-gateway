import { Module } from '@nestjs/common';
import { AssociationKeysService } from './service';
import { AssociationKeysRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Module({
  imports: [
    SecretsEngineModule,
    DdhubClientGatewayUtilsModule,
    AssociationKeysRepositoryModule,
  ],
  providers: [AssociationKeysService],
  exports: [AssociationKeysService],
})
export class DdhubClientGatewayAssociationKeysModule {}
