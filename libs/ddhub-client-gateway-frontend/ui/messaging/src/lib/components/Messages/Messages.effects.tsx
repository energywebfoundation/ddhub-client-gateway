import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import {
  useCachedChannel,
  useMessages,
  useIdentity,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import {
  Queries,
  didFormatMinifier,
} from '@ddhub-client-gateway-frontend/ui/utils';
import { TMessage } from './Messages.type';
import { FileContentType } from './Messages.utils';

export const useMessagesEffects = () => {
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
    clientId: `${identity?.enrolment?.did}-${dayjs().format(
      'YYYYMMDD_HHmmss'
    )}`,
  });

  const data: TMessage[] = messages.map((message) => {
    return {
      timestampNanos: dayjs(message?.timestampNanos).format('MM/DD/YYYY'),
      sender: didFormatMinifier(message?.sender),
      schemaType: message?.topicSchemaType,
      details: {
        topicOwner: topic.owner,
        topicName: topic.topicName,
        topicVersion: message?.topicVersion,
        messageId: message?.id,
      },
      fileData: {
        payload: message?.payload,
        contentType: FileContentType[message?.topicSchemaType],
      },
    };
  });

  const loading = !messagesLoaded;

  return {
    topic,
    channel: cachedChannel,
    messages: data,
    loading,
  };
};
