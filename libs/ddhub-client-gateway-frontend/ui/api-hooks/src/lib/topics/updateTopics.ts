import {
  PostTopicDto,
  UpdateTopicBodyDto,
  UpdateTopicHistoryBodyDto,
  useTopicsControllerUpdateTopics,
  useTopicsControllerUpdateTopicsByIdAndVersion,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useUpdateTopics = (canUpdateSchema: boolean) => {
  const Swal = useCustomAlert();
  const { mutate: mutateTopic, isLoading: topicMutationLoading } =
    useTopicsControllerUpdateTopics();
  const {
    mutate: mutateTopicByVersion,
    isLoading: topicVersionByMutationLoading,
  } = useTopicsControllerUpdateTopicsByIdAndVersion();

  const updateError = (error: any) => {
    console.error(error);
    Swal.error({ text: error.message });
  };

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
