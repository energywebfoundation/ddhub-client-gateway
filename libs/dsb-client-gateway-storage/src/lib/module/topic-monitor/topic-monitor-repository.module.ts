import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicMonitorEntity } from './entity/topic-monitor.entity';
import { TopicMonitorRepository } from './repository';
import { TopicMonitorRepositoryWrapper } from './wrapper/topic-monitor-repository.wrapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicMonitorEntity, TopicMonitorRepository]),
  ],
  providers: [TopicMonitorRepositoryWrapper],
  exports: [TopicMonitorRepositoryWrapper],
})
export class TopicMonitorRepositoryModule {}
