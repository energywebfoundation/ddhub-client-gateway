import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronEntity } from './entity/cron.entity';
import { CronRepository } from './repository/cron.repository';
import { CronWrapperRepository } from './wrapper/cron-wrapper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CronEntity, CronRepository])],
  providers: [CronWrapperRepository],
  exports: [CronWrapperRepository],
})
export class CronRepositoryModule {}
