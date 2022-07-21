import { Module } from '@nestjs/common';
import {
  ApplicationRepositoryModule,
  CronRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ApplicationService } from './service/application.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CronRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    CqrsModule,
  ],
  providers: [ApplicationService],
})
export class ApplicationModule {}
