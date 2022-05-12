import { useState } from 'react';
import { keyBy } from 'lodash';
import {
  useChannels,
  useUploadMessage,
  useTopicVersionHistory,
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
  const [selectedTopicVersion, setSelectedTopicVersion] = useState<string>('');

  const { topicHistory, isLoading: topicHistoryLoading } =
    useTopicVersionHistory(selectedTopic);

  const channelOptions = channels.map((channel) => ({
    label: channel.fqcn,
    value: channel.fqcn,
  }));

  const topicHistoryOptions = topicHistory.map((topic) => ({
    label: topic.version,
    value: topic.version,
  }));

  const topics = channelsByName[selectedChannel]?.conditions?.topics ?? [];
  const topicsById = keyBy(topics, 'topicId');

  const topicsOptions =
    channelsByName[selectedChannel]?.conditions?.topics.map((topic) => ({
      label: topic.topicName,
      value: topic.topicId,
    })) || [];

  const onFileChange = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const onChannelChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    if (newInputValue === null) {
      setSelectedTopic('');
      setSelectedTopicVersion('');
    } else {
      setSelectedChannel(newInputValue?.value);
    }
  };

  const onTopicChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    if (newInputValue === null) {
      setSelectedTopicVersion('');
    } else {
      setSelectedTopic(newInputValue?.value);
    }
  };

  const onTopicVersionChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    setSelectedTopicVersion(newInputValue?.value);
  };

  const onUpload = () => {
    setSelectedTopic('');
    setSelectedTopicVersion('');
    setSelectedChannel('');
    setSelectedFile(undefined);
  };

  const submitHandler = () => {
    uploadMessageHandler({
      file: selectedFile as Blob,
      fqcn: selectedChannel,
      topicName: topicsById[selectedTopic]?.topicName,
      topicOwner: topicsById[selectedTopic]?.owner,
      topicVersion: selectedTopicVersion,
    }, onUpload);
  };

  const topicsFieldDisabled = topicsOptions.length === 0;
  const topicVersionsFieldDisabled = topicHistoryOptions.length === 0;
  const buttonDisabled = !selectedChannel || !selectedTopic || !selectedFile;

  return {
    channelOptions,
    topicHistoryOptions,
    channelsLoading,
    topicHistoryLoading,
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
    selectedTopicVersion,
    onTopicVersionChange,
    topicVersionsFieldDisabled,
    selectedFile
  };
};
