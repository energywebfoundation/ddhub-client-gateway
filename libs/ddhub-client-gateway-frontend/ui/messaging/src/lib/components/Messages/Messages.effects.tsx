import { useRouter } from 'next/router';
import {
  useChannel,
  useMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import {
  Queries,
  didFormatMinifier,
  publicConfig,
} from '@ddhub-client-gateway-frontend/ui/utils';
import { TMessage } from './Messages.type';
import { FileContentType, formatTimestampFromNanos } from './Messages.utils';
import moment from 'moment';

export const useMessagesEffects = () => {
  const router = useRouter();
  const fqcn = router.query[Queries.FQCN] as string;
  const topicId = router.query[Queries.TopicId] as string;

  const { channel, isLoading: channelLoading } = useChannel(fqcn);
  const topic = channel.conditions?.topics?.find(
    (item) => item.topicId === topicId
  );

  const currentDate = moment().seconds(0).milliseconds(0);
  const fromDate = moment(currentDate).subtract(
    publicConfig.messagingOffset,
    'minutes'
  );

  const { messages, messagesLoaded } = useMessages({
    fqcn,
    topicName: topic?.topicName,
    topicOwner: topic?.owner,
    clientId: 'cgui',
    from: fromDate.toISOString(),
    amount: publicConfig.messagingAmount,
  });

  const data: TMessage[] = messages.map((message) => {
    return {
      timestamp: formatTimestampFromNanos(message?.timestampNanos),
      timestampNanos: message?.timestampNanos,
      sender: didFormatMinifier(message?.sender),
      schemaType: message?.topicSchemaType,
      details: {
        topicOwner: topic?.owner,
        topicName: topic?.topicName,
        topicVersion: message?.topicVersion,
        messageId: message?.id,
      },
      fileData: {
        payload: message?.payload,
        contentType: FileContentType[message?.topicSchemaType],
      },
    };
  });

  const loading =
    !router.isReady || channelLoading || (!!topic && !messagesLoaded);

  return {
    topic,
    channel,
    messages: data,
    loading,
  };
};
