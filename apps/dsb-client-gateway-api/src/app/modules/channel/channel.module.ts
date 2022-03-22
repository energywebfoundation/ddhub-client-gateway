import { Module } from '@nestjs/common';
import { ChannelController } from './controller/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './service/channel.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DsbClientModule, StorageModule],
  providers: [ChannelRepository, ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
