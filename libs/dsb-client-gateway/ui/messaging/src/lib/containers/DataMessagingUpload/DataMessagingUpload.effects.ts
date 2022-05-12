import { useState } from 'react';
import { keyBy } from 'lodash';
import {
  useChannels,
  useUploadMessage,
} from '@dsb-client-gateway/ui/api-hooks';

type TOption = {
  label: string;
  value: string;
};

export const useDataMessagingUploadEffects = () => {
  const { uploadMessageHandler, isLoading: isUploading } = useUploadMessage();
  const {
    channels,
    channelsByName,
    isLoading: channelsLoading,
  } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File>();

  const channelOptions = channels.map((channel) => ({
    label: channel.fqcn,
    value: channel.fqcn,
  }));

  const topics = channelsByName[selectedChannel]?.conditions?.topics ?? [];
  const topicsById = keyBy(topics, 'topicId');

  const topicsOptions =
    channelsByName[selectedChannel]?.conditions?.topics.map((topic) => ({
      label: topic.topicName,
      value: topic.topicId,
    })) || [];

  const topicsFieldDisabled = topicsOptions.length === 0;

  const onFileChange = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const onChannelChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    if (newInputValue === null) {
      setSelectedTopic('');
    }
    setSelectedChannel(newInputValue?.value);
  };

  const onTopicChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    setSelectedTopic(newInputValue?.value);
  };

  const submitHandler = () => {
    uploadMessageHandler({
      file: selectedFile as Blob,
      fqcn: selectedChannel,
      topicName: topicsById[selectedTopic]?.topicName,
      topicOwner: topicsById[selectedTopic]?.owner,
      // TODO: get topic version
      topicVersion: '1.0.0',
    });
  };

  const buttonDisabled = !selectedChannel || !selectedTopic || !selectedFile;

  return {
    channelOptions,
    channelsLoading,
    onChannelChange,
    onTopicChange,
    topicsFieldDisabled,
    topicsOptions,
    selectedTopic,
    selectedChannel,
    onFileChange,
    isUploading,
    submitHandler,
    topicsById,
    buttonDisabled,
  };
};
