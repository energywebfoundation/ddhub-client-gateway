import { Module } from '@nestjs/common';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CronService } from './service/cron.service';
import { CronController } from './controller/cron.controller';

@Module({
  imports: [CronRepositoryModule],
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
