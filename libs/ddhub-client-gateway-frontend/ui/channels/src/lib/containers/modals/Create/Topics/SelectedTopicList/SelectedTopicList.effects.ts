import { useState } from 'react';
import { useTopics } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Topic } from '../Topics.effects';
import { differenceBy } from 'lodash';
import {
  GetTopicDto,
  ResponseTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface SelectedTopicListEffectsProps {
  filters: any[];
  selectedTopics: Topic[];
  responseTopics?: ResponseTopicDto[];
}

export const useSelectedTopicListEffects = ({
  filters,
  selectedTopics,
  responseTopics = [],
}: SelectedTopicListEffectsProps) => {
  const [selectedApplication, setSelectedApplication] = useState('');

  const { topics, topicsLoading } = useTopics({ owner: selectedApplication });
  const filteredTopics = topics
    .filter((item) => filters.includes(item.schemaType))
    .map((topic: GetTopicDto) => ({
      label: topic.name,
      topicName: topic.name,
      ...topic,
    }));

  const formattedSelectedTopics = selectedTopics.map((topic) => ({
    id: topic.topicId,
    ...topic,
  }));

  const availableTopics: Topic[] = differenceBy(
    filteredTopics,
    formattedSelectedTopics,
    'id'
  );

  const getSelectedResponseTopics = (selectedTopicId: string) => {
    const selectedResponseTopics = responseTopics.filter(
      (topic) => topic.responseTopicId === selectedTopicId
    );

    return selectedResponseTopics;
  };

  return {
    setSelectedApplication,
    availableTopics,
    selectedApplication,
    topicsLoading,
    filteredTopics,
    getSelectedResponseTopics,
  };
};
