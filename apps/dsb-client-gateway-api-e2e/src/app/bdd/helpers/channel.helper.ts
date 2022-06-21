import { ChannelWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';

export const givenIHaveEmptyListOfChannels = (given, app) => {
  given('No channels exists', async () => {
    await app().get(ChannelWrapperRepository).channelRepository.clear();
  });
};
