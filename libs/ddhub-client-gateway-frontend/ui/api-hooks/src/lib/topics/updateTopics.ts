import {
  PostTopicDto,
  UpdateTopicBodyDto,
  UpdateTopicHistoryBodyDto,
  useTopicsControllerUpdateTopics,
  useTopicsControllerUpdateTopicsByIdAndVersion,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUpdateTopics = (canUpdateSchema: boolean) => {
  const { mutate: mutateTopic, isLoading: topicMutationLoading } =
    useTopicsControllerUpdateTopics();
  const {
    mutate: mutateTopicByVersion,
    isLoading: topicVersionByMutationLoading,
  } = useTopicsControllerUpdateTopicsByIdAndVersion();

  const updateTopic = (
    topic: PostTopicDto,
    onSuccess: () => void,
    onError: () => void
  ) => {
    const { id, tags } = topic;
    mutateTopic(
      {
        id,
        data: { tags } as UpdateTopicBodyDto,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  const updateTopicByVersion = (
    topic: PostTopicDto,
    onSuccess: () => void,
    onError: () => void
  ) => {
    const { id, version, schema } = topic;
    mutateTopicByVersion(
      {
        id,
        versionNumber: version,
        data: { schema } as UpdateTopicHistoryBodyDto,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  const updateTopicHandler = canUpdateSchema
    ? updateTopicByVersion
    : updateTopic;
  const isLoading = topicMutationLoading || topicVersionByMutationLoading;

  return {
    updateTopicHandler,
    isLoading,
  };
};
