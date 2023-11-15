import { Module } from '@nestjs/common';
import { ApplicationsController } from './controller/application.controller';
import {
  ApplicationRepositoryModule,
  DsbClientGatewayStorageModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ApplicationsService } from './service/applications.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    DdhubClientGatewayUserRolesModule,
    DsbClientGatewayStorageModule,
    DdhubClientGatewayMessageBrokerModule,
    ApplicationRepositoryModule,
  ],
  providers: [ApplicationsService],
  exports: [],
  controllers: [ApplicationsController],
})
export class ApplicationModule {}
