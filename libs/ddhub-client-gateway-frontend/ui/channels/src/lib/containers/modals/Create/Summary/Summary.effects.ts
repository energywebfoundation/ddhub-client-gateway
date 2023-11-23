import {
  ChannelConditionsDto,
  ResponseTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useSummaryEffects = (responseTopics: ResponseTopicDto[]) => {
  const countRestrictions = (conditions: ChannelConditionsDto) => {
    return conditions.dids.length + conditions.roles.length;
  };

  const getSelectedResponseTopics = (selectedTopicId: string) => {
    const selectedResponseTopics = responseTopics.filter(
      (topic) => topic.responseTopicId === selectedTopicId,
    );

    return selectedResponseTopics;
  };

  return { countRestrictions, getSelectedResponseTopics };
};
