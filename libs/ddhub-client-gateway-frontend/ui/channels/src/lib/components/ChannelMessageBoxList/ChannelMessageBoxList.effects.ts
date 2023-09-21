import { useChannelMessagesCount } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useChannelMessageBoxListEffects = () => {
  const { channels, isLoading } = useChannelMessagesCount();

  return { channels, isLoading };
};
