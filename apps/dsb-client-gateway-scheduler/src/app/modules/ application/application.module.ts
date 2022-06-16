import { Module } from '@nestjs/common';
import {
  ApplicationRepositoryModule,
  CronRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ApplicationService } from './service/application.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    CronRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync(),
  ],
  providers: [ApplicationService],
})
export class ApplicationModule {}
