import { useState } from 'react';
import { keyBy } from 'lodash';
import {
  useChannels,
  useTopicVersionHistory,
  useUploadMessage,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { DataMessagingUploadProps } from './DataMessagingUpload';
import { TFileType } from '../UploadForm/UploadForm.types';
import { TOption } from './DataMessagingUpload.types';
import {
  bytesToMegaBytes,
  FileType,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from './DataMessagingUpload.utils';

export const useDataMessagingUploadEffects = ({
  isLarge = false,
}: DataMessagingUploadProps) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedTopicVersion, setSelectedTopicVersion] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File>();

  const { messageSubmitHandler, isLoading: isUploading } =
    useUploadMessage(isLarge);
  const {
    channels,
    channelsByName,
    isLoading: channelsLoading,
  } = useChannels();

  const filteredChannels = channels.filter((channel) =>
    isLarge
      ? channel.type === UpdateChannelDtoType.upload
      : channel.type === UpdateChannelDtoType.pub
  );

  const {
    topicHistory,
    topicHistoryByVersion,
    isLoading: topicHistoryLoading,
  } = useTopicVersionHistory({ id: selectedTopic });

  const channelOptions = filteredChannels.map((channel) => ({
    label: channel.fqcn,
    value: channel.fqcn,
  }));

  const topicHistoryOptions = topicHistory.map((topic) => ({
    label: topic.version,
    value: topic.version,
  }));

  const topics = channelsByName[selectedChannel]?.conditions?.topics ?? [];
  const topicsById = keyBy(topics, 'topicId');
  const selectedTopicWithSchema = topicHistoryByVersion[selectedTopicVersion];

  const topicInputValue = topicsById[selectedTopic]?.topicName ?? '';
  const acceptedFiles = selectedFile ? [selectedFile] : [];
  const uploadFileType = isLarge
    ? FileType[selectedTopicWithSchema?.schemaType]
    : ('json' as TFileType);
  const maxFileSize = isLarge ? MAX_FILE_SIZE : MIN_FILE_SIZE;
  const fileSizeInfo = `Max file size: ${isLarge ? bytesToMegaBytes(MAX_FILE_SIZE) : bytesToMegaBytes(MIN_FILE_SIZE)}mb`;

  const topicsOptions =
    topics.map((topic) => ({
      label: topic.topicName,
      value: topic.topicId,
    })) || [];

  const onFileChange = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
  };

  const onChannelChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    if (newInputValue === null) {
      setSelectedChannel('');
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
      setSelectedTopic('');
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

  const submitHandler = async () => {
    messageSubmitHandler(
      {
        file: selectedFile as Blob,
        fqcn: selectedChannel,
        topicName: topicsById[selectedTopic]?.topicName,
        topicOwner: topicsById[selectedTopic]?.owner,
        topicVersion: selectedTopicVersion,
      },
      onUpload
    );
  };

  const buttonDisabled =
    !selectedChannel ||
    !selectedTopic ||
    !selectedFile ||
    !selectedTopicVersion;

  return {
    channelOptions,
    topicHistoryOptions,
    channelsLoading,
    topicHistoryLoading,
    onChannelChange,
    onTopicChange,
    topicsOptions,
    selectedChannel,
    onFileChange,
    isUploading,
    submitHandler,
    buttonDisabled,
    selectedTopicVersion,
    onTopicVersionChange,
    acceptedFiles,
    uploadFileType,
    maxFileSize,
    fileSizeInfo,
    topicInputValue,
  };
};
