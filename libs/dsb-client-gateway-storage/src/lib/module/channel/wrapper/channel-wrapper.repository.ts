import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository/channel.repository';
import { ChannelEntity } from '../entity';
import { ChannelType } from '../../../../../../../apps/dsb-client-gateway-api/src/app/modules/channel/channel.const';

export interface QueryChannels {
  type?: ChannelType;
  useAnonymousExtChannel?: boolean;
  payloadEncryption?: boolean;
  messageForms?: boolean;
}

@Injectable()
export class ChannelWrapperRepository {
  constructor(public readonly channelRepository: ChannelRepository) {}

  public async fetch(query: QueryChannels): Promise<ChannelEntity[]> {
    const { type, useAnonymousExtChannel, payloadEncryption, messageForms } =
      query;
    const conditions: Partial<QueryChannels> = {};

    if (type) {
      conditions.type = type;
    }

    if (useAnonymousExtChannel !== undefined) {
      conditions.useAnonymousExtChannel = useAnonymousExtChannel;
    }

    if (payloadEncryption !== undefined) {
      conditions.payloadEncryption = payloadEncryption;
    }

    if (messageForms !== undefined) {
      conditions.messageForms = messageForms;
    }

    return this.channelRepository.find({
      where: conditions,
    });
  }
}
