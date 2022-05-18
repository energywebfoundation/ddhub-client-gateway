import { Module } from '@nestjs/common';
import { DdhubClientGatewayEncryptionModule } from '@dsb-client-gateway/ddhub-client-gateway-encryption';
import { SymmetricKeysCronService } from './service/symmetric-keys-cron.service';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DdhubClientGatewayEncryptionModule, CronRepositoryModule],
  providers: [SymmetricKeysCronService],
})
export class KeysModule {}
