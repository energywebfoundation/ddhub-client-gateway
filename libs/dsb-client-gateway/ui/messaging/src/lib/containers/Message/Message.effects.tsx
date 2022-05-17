import { useRouter } from 'next/router';
import { Download } from 'react-feather';
import dayjs from 'dayjs';
import { CircularProgress } from '@mui/material';
import {
  useCachedChannel,
  useCachedMessages,
  useTopicVersion,
  useDownloadMessage,
  useMessages,
  useIdentity
} from '@dsb-client-gateway/ui/api-hooks';
import { Queries, didFormatMinifier } from '@dsb-client-gateway/ui/utils';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { useStyles } from './Message.styles';
import { TMessage } from './Message.type';

export const useMessageEffects = () => {
  const { classes, theme } = useStyles();
  const router = useRouter();

  const { identity } = useIdentity();

  const { cachedChannel, topicsByName } = useCachedChannel(
    router.query[Queries.FQCN] as string
  );

  const topic = topicsByName[router.query[Queries.TopicName] as string];

    const { messages, messagesLoaded } = useMessages({
    fqcn: router.query[Queries.FQCN] as string,
    topicName: topic?.topicName,
    topicOwner: topic?.owner,
    clientId: identity?.enrolment?.did
  });

  // const { cachedMessages, messagesById } = useCachedMessages({
  //   fqcn: router.query[Queries.FQCN] as string,
  // });

  // const message = messagesById[router.query[Queries.MessageId] as string];

  // const { topic: topicWithSchema, topicLoaded } = useTopicVersion(
  //   topic?.topicId,
  //   message?.topicVersion
  // );

  const { downloadMessageHandler, isLoading: isDownloading, fileId } = useDownloadMessage();

  const loading = !router.isReady || !messagesLoaded;

  const data: TMessage[] = messages.map(message => {
    return {
      timestampNanos: dayjs(message?.timestampNanos).format('MM/DD/YYYY'),
      sender: didFormatMinifier(message?.sender),
      fileId: message?.payload
    };
  })

  // const actions: TTableComponentAction<TMessage>[] = [
  //   {
  //     label: 'Download',
  //     onClick: (message: TMessage) => downloadMessageHandler('hello'),
  //     icon: isDownloading ? (
  //       <CircularProgress
  //         size={17}
  //         sx={{ color: theme.palette.primary.main }}
  //       />
  //     ) : (
  //       <Download className={classes.icon} />
  //     ),
  //   },
  // ];

  const downloadData = {
    loading: isDownloading,
    fileId
  }

  console.log(downloadData, 'downloadData');

  return {
    topic,
    channel: cachedChannel,
    downloadMessageHandler,
    messages: data,
    loading,
    downloadData
  };
};
