import { Module } from '@nestjs/common';
import { SymmetricKeysCacheService } from './service';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { SymmetricKeysRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    DdhubClientGatewayEnrolmentModule,
    DdhubClientGatewayIdentityModule,
    SymmetricKeysRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync(),
  ],
  providers: [SymmetricKeysCacheService],
  exports: [SymmetricKeysCacheService],
})
export class DdhubClientGatewayEncryptionModule {}
