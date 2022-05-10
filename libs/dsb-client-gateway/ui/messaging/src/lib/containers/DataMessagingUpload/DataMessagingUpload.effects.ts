import { useState } from 'react';
import { useChannels } from '@dsb-client-gateway/ui/api-hooks';

export const useDataMessagingUploadEffects = () => {
  const {
    channels,
    channelsByName,
    isLoading: channelsLoading,
  } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const channelOptions = channels.map((channel) => ({
    label: channel.fqcn,
    value: channel.fqcn,
  }));

  const topicsOptions =
    channelsByName[selectedChannel]?.conditions?.topics.map((topic) => ({
      label: topic.topicName,
      value: topic.topicName,
    })) || [];

  const topicsFieldDisabled = topicsOptions.length === 0;

  return {
    channelOptions,
    channelsLoading,
    setSelectedChannel,
    setSelectedTopic,
    topicsFieldDisabled,
    topicsOptions,
    selectedTopic,
  };
};
