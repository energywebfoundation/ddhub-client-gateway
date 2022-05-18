import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const getChannelTypeImage = (type: UpdateChannelDtoType) => {
  switch (type) {
    case UpdateChannelDtoType.pub:
    case UpdateChannelDtoType.sub:
      return '/icons/messaging-light.svg';

    case UpdateChannelDtoType.upload:
    case UpdateChannelDtoType.download:
      return '/icons/file-transfer-light.svg';

    default:
      return '/icons/messaging-light.svg';
  }
};
