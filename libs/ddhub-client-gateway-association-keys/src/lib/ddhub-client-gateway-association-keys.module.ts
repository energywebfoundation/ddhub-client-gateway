import { Module } from '@nestjs/common';
import { AssociationKeysService } from './service';
import { AssociationKeysRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    SecretsEngineModule,
    DdhubClientGatewayUtilsModule,
    AssociationKeysRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
  ],
  providers: [AssociationKeysService],
  exports: [AssociationKeysService],
})
export class DdhubClientGatewayAssociationKeysModule {}
