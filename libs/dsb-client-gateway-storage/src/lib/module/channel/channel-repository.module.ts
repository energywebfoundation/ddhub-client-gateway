import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './entity/channel.entity';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelWrapperRepository } from './wrapper/channel-wrapper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity, ChannelRepository])],
  providers: [ChannelWrapperRepository],
  exports: [ChannelWrapperRepository],
})
export class ChannelRepositoryModule {}
