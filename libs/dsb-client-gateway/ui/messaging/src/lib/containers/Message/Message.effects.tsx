import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import {
  useCachedChannel,
  useMessages,
  useIdentity
} from '@dsb-client-gateway/ui/api-hooks';
import { Queries, didFormatMinifier } from '@dsb-client-gateway/ui/utils';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { TMessage } from './Message.type';
import { FileContentType } from './Message.utils';
import { MessageProps } from './Message';

export const useMessageEffects = ({ isLarge = false }: MessageProps) => {
  const router = useRouter();
  const { identity } = useIdentity();

  const { cachedChannel, topicsById } = useCachedChannel(
    router.query[Queries.FQCN] as string
  );

  const topic = topicsById[router.query[Queries.TopicId] as string];

    const { messages, messagesLoaded } = useMessages({
    fqcn: router.query[Queries.FQCN] as string,
    topicName: topic?.topicName,
    topicOwner: topic?.owner,
    clientId: `${identity?.enrolment?.did}-${dayjs().format('YYYY-MM-DD HH:mm')}`
  });

  const loading = !messagesLoaded;

  const data: TMessage[] = messages.map(message => {
    return {
      timestampNanos: dayjs(message?.timestampNanos).format('MM/DD/YYYY'),
      sender: didFormatMinifier(message?.sender),
      schemaType: message?.topicSchemaType,
      fileData: {
        payload: message?.payload,
        contentType: FileContentType[message?.topicSchemaType]
      }
    };
  })

  const actions: TTableComponentAction<TMessage>[] = [
    {
      label: 'View details',
      onClick: () => console.log('view'),
    }
  ];

  return {
    topic,
    channel: cachedChannel,
    messages: data,
    loading,
    actions
  };
};
