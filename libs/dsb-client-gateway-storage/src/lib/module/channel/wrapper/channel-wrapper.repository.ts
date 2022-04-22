import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository/channel.repository';

@Injectable()
export class ChannelWrapperRepository {
  constructor(public readonly channelRepository: ChannelRepository) {}
}
