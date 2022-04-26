import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { TopicRepository } from './repository';
import { TopicRepositoryWrapper } from './wrapper/topic-repository.wrapper';

@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity, TopicRepository])],
  providers: [TopicRepositoryWrapper],
  exports: [TopicRepositoryWrapper],
})
export class TopicRepositoryModule {}
