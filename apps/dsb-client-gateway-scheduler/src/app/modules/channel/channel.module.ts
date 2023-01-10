import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TopicDeletedHandler } from './handler/topic-deleted.handler';
import { ChannelRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [CqrsModule, ChannelRepositoryModule],
  providers: [TopicDeletedHandler],
})
export class ChannelModule {}
