import { GetChannelResponseDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelType } from '../models/channel-type.enum';

export const getChannelType = (type: GetChannelResponseDtoType) => {
  switch (type) {
    case GetChannelResponseDtoType.pub:
    case GetChannelResponseDtoType.sub:
      return ChannelType.Messaging;

    case GetChannelResponseDtoType.upload:
    case GetChannelResponseDtoType.download:
      return ChannelType.FileTransfer;

    default:
      return ChannelType.Messaging;
  }
};
