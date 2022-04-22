import { useChannels } from '@dsb-client-gateway/ui/api-hooks';

export const useChannelsContainerEffects = () => {
  const {channels, isLoading} = useChannels();

  const onCreateHandler = () => {

  }

  return {channels, isLoading, onCreateHandler};
}
