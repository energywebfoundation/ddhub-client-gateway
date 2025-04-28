import { Injectable, Logger } from '@nestjs/common';
import {
    ChannelEntity,
    ChannelWrapperRepository,
  } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';

@Injectable()
export class ChannelService {
  protected readonly logger = new Logger(ChannelService.name);

  constructor(
    protected readonly wrapperRepository: ChannelWrapperRepository) {}

    @Span('channels_getChannel')
    public async getChannel(fqcn: string): Promise<ChannelEntity | null> {
        return this.wrapperRepository.channelRepository.findOne({
            where: {
                fqcn,
            },
        });
    }
}