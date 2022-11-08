import { useState } from 'react';
import { useTopics } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Topic } from '../Topics.effects';
import { differenceBy } from 'lodash';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface SelectedTopicListEffectsProps {
  filters: any[];
  selectedTopics: Topic[];
}

export const useSelectedTopicListEffects = (
  {
    filters,
    selectedTopics,
  }: SelectedTopicListEffectsProps
) => {
  const [selectedApplication, setSelectedApplication] = useState('');

  const { topics, topicsLoading } = useTopics({ owner: selectedApplication });
  const filteredTopics = topics.filter(
    (item) => filters.includes(item.schemaType)
  );

  const formattedSelectedTopics = selectedTopics.map((topic) => ({
    id: topic.topicId,
    ...topic,
  }));

  const availableTopics: Topic[] = differenceBy(
    filteredTopics,
    formattedSelectedTopics,
    'id'
  ).map((topic: GetTopicDto) => ({
    label: topic.name,
    topicName: topic.name,
    ...topic,
  }));

  return {
    setSelectedApplication,
    availableTopics,
    selectedApplication,
    topicsLoading,
  }
};
