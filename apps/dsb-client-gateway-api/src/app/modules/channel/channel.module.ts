import { Module } from '@nestjs/common';
import { ChannelController } from './controller/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './service/channel.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';

@Module({
  imports: [DsbClientModule],
  providers: [ChannelRepository, ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
