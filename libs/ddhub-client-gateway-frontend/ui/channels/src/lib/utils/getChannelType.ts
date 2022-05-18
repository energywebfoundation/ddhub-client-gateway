import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelType } from '../models/channel-type.enum';

export const getChannelType = (type: UpdateChannelDtoType) => {
  switch (type) {
    case UpdateChannelDtoType.pub:
    case UpdateChannelDtoType.sub:
      return ChannelType.Messaging;

    case UpdateChannelDtoType.upload:
    case UpdateChannelDtoType.download:
      return ChannelType.FileTransfer;

    default:
      return ChannelType.Messaging;
  }
};
