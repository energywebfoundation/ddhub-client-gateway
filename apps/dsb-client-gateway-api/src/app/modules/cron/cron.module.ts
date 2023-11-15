import { Module } from '@nestjs/common';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CronService } from './service/cron.service';
import { CronController } from './controller/cron.controller';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [CronRepositoryModule, DdhubClientGatewayUserRolesModule],
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
