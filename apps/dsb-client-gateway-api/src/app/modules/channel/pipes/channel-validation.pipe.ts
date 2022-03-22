import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ChannelService } from '../service/channel.service';
import { ChannelEntity } from '../entity/channel.entity';
import { CreateChannelDto } from '../dto/request/create-channel.dto';
import { ChannelAlreadyExistsException } from '../exceptions/channel-already-exists.exception';

@Injectable()
export class ChannelValidationPipe implements PipeTransform<unknown> {
  constructor(protected readonly channelService: ChannelService) {}

  public transform(value: CreateChannelDto, metadata: ArgumentMetadata): any {
    const channel: ChannelEntity | null = this.channelService.getChannel(
      value.channelName
    );

    if (channel) {
      throw new ChannelAlreadyExistsException();
    }

    return value;
  }
}
