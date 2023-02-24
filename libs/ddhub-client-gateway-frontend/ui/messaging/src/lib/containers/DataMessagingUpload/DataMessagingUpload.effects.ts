import { useLayoutEffect, useState } from 'react';
import { keyBy } from 'lodash';
import {
  messageDataService,
  useChannels,
  useTopicVersionHistory,
  useUploadMessage,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import {
  SendMessageDto,
  SendMessagelResponseDto,
  UpdateChannelDtoType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { DataMessagingUploadProps } from './DataMessagingUpload';
import { TFileType } from '../UploadForm/UploadForm.types';
import { TOption } from './DataMessagingUpload.types';
import {
  bytesToMegaBytes,
  FileType,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from './DataMessagingUpload.utils';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useDataMessagingUploadEffects = ({
  isLarge = false,
}: DataMessagingUploadProps) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedTopicVersion, setSelectedTopicVersion] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const [anonymousRecipients, setAnonymousRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [recent, setRecent] = useState('');
  const [toggleUpdate, setToggleUpdate] = useState(false);

  const { uploadMessageHandler, createMessageHandler, isLoading: isUploading } =
    useUploadMessage(isLarge);
  const {
    channels,
    channelsByName,
    isLoading: channelsLoading,
  } = useChannels();
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();

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

  useLayoutEffect(() => {
    const subscription = messageDataService.getData().subscribe((message: any) => {

      if (message?.value) {
        uploadMessageSuccess(message.value);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const topics = channelsByName[selectedChannel]?.conditions?.topics ?? [];
  const topicsById = keyBy(topics, 'topicId');
  const selectedTopicWithSchema = topicHistoryByVersion[selectedTopicVersion];
  const showAnonymousRecipient = channelsByName[selectedChannel]?.useAnonymousExtChannel && !isLarge;

  const topicInputValue = topicsById[selectedTopic]?.topicName ?? '';
  const acceptedFiles = selectedFile ? [selectedFile] : [];
  const uploadFileType = isLarge
    ? FileType[selectedTopicWithSchema?.schemaType]
    : ('json' as TFileType);
  const maxFileSize = isLarge ? MAX_FILE_SIZE : MIN_FILE_SIZE;
  const fileSizeInfo = `Max file size: ${
    isLarge ? bytesToMegaBytes(MAX_FILE_SIZE) : bytesToMegaBytes(MIN_FILE_SIZE)
  }mb`;

  const topicsOptions =
    topics.map((topic) => ({
      label: topic.topicName,
      value: topic.topicId,
    })) || [];

  const showModal = (data: SendMessagelResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_POST_DETAILS,
      payload: {
        open: true,
        data,
      },
    });
  };

  const uploadMessageSuccess = async (res: SendMessagelResponseDto) => {
    const recipients = res.recipients;

    if (recipients) {
      const isFailAll = recipients.failed === recipients.total;
      const isPartialSuccess = recipients.sent !== recipients.total;

      if (isFailAll) {
        const result = await Swal.fire({
          title: `Failed to send to all ${recipients.total} users.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'View recipients',
          cancelButtonText: 'Close',
        });

        if (result.isConfirmed) {
          showModal(res);
        }
      } else {
        let partialInfo = '';

        if (isPartialSuccess) {
          partialInfo = `, <span style="color: #2EB67D">${recipients.sent} succeeded</span> and <span style="color: #FD1803">${recipients.failed} failed</span>.`;
        }

        const result = await Swal.fire({
          title: `Message sent to ${recipients.total} users${partialInfo}`,
          type: 'success',
          showCancelButton: true,
          confirmButtonText: 'View recipients',
          cancelButtonText: 'Close',
        });

        if (result.isConfirmed) {
          showModal(res);
        }
      }
    } else {
      const errData = {
        response: {
          data: res,
        },
      };

      await Swal.httpError(errData);
    }
  };

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
    } else {
      setSelectedChannel(newInputValue?.value);
    }

    setSelectedTopic('');
    setSelectedTopicVersion('');
    setAnonymousRecipients([]);
  };

  const onTopicChange = (
    _event: React.SyntheticEvent,
    newInputValue: TOption
  ) => {
    if (newInputValue === null) {
      setSelectedTopic('');
    } else {
      setSelectedTopic(newInputValue?.value);
    }

    setSelectedTopicVersion('');
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
    const sendMessageObj = {
      fqcn: selectedChannel,
      topicName: topicsById[selectedTopic]?.topicName,
      topicOwner: topicsById[selectedTopic]?.owner,
      topicVersion: selectedTopicVersion,
      file: selectedFile as Blob,
    };

    if (isLarge) {
      uploadMessageHandler(sendMessageObj, onUpload);
    } else {
      const { file, ...rest } = sendMessageObj;
      const payload = await file.text();

      const formattedValues = {
        ...rest,
        payload,
        anonymousRecipient: anonymousRecipients,
      } as SendMessageDto;

      createMessageHandler(formattedValues, onUpload);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clear = () => {
    setRecipientInput('');
  };

  const handleOpen = () => {
    clear();
    setOpen(true);
  };

  const removeRecipient = (value: string) => {
    setAnonymousRecipients(anonymousRecipients.filter((recipient) => recipient !== value));
  };

  const addRecipient = (recipient: string) => {
    if (!anonymousRecipients.includes(recipient)) {
      const recipientsToSet = [recipient, ...anonymousRecipients];
      setAnonymousRecipients(recipientsToSet);
    }

    clear();
  };

  const handleSaveRecipient = () => {
    setRecent(recipientInput);
    addRecipient(recipientInput);
  };

  const handleUpdateRecipient = (removeInput: string) => {
    const filteredRecipients = anonymousRecipients.filter((recipient) => recipient !== removeInput);

    if (!filteredRecipients.includes(recipientInput)) {
      filteredRecipients.unshift(recipientInput);

      setRecent(recipientInput);
      setAnonymousRecipients(filteredRecipients);
    }

    clear();
  };

  const handleOpenForm = (formValue: any) => {
    setRecipientInput(formValue.selectValue);
  };

  const handleCloseForm = () => {
    setToggleUpdate(!toggleUpdate);
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
    showAnonymousRecipient,
    open,
    handleClose,
    handleOpen,
    recipientInput,
    setRecipientInput,
    handleSaveRecipient,
    anonymousRecipients,
    handleUpdateRecipient,
    removeRecipient,
    recent,
    handleOpenForm,
    clear,
    handleCloseForm,
    toggleUpdate,
  };
};
