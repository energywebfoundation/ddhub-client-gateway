import { Injectable, PipeTransform } from '@nestjs/common';
import { ChannelService } from '../service/channel.service';
import { CreateChannelDto } from '../dto/request/create-channel.dto';
import { ChannelAlreadyExistsException } from '../exceptions/channel-already-exists.exception';
import { ChannelEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Injectable()
export class ChannelValidationPipe implements PipeTransform<unknown> {
  constructor(protected readonly channelService: ChannelService) {}

  public async transform(value: CreateChannelDto) {
    const channel: ChannelEntity | null = await this.channelService.getChannel(
      value.fqcn
    );

    if (channel) {
      throw new ChannelAlreadyExistsException(value.fqcn);
    }

    return value;
  }
}
