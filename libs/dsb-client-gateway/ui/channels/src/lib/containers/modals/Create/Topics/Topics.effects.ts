import { useApplications, useTopics } from '@dsb-client-gateway/ui/api-hooks';
import { useState } from 'react';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface Topic extends Partial<GetTopicDto> {
  owner: string;
  topicName: string;
}

export const useTopicsEffects = () => {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const { applications, isLoading: isLoadingApplications } = useApplications();

  const { topics } = useTopics(selectedApplication);

  const isNotEqual = (topic1: Topic, topic2: Topic) => {
    return (
      topic1.topicName !== topic2.topicName && topic1.owner !== topic2.owner
    );
  };

  const isEqual = (topic1: Topic, topic2: Topic) => {
    return (
      topic1.topicName === topic2.topicName && topic1.owner === topic2.owner
    );
  };

  const addSelectedTopic = (selectedTopic: Topic) => {
    const exist =
      topics.findIndex((topic) => topic.name === selectedTopic.name) > -1;
    if (!exist) {
      return;
    }
    setSelectedTopics([
      ...selectedTopics,
      {
        ...selectedTopic,
        owner: selectedApplication,
        topicName: selectedTopic.name as string,
      },
    ]);
  };

  const removeSelectedTopic = (data: Topic) => {
    setSelectedTopics(selectedTopics.filter((topic) => !isEqual(topic, data)));
  };

  const availableTopics: Topic[] = topics
    .map((topic: GetTopicDto) => ({
      label: topic.name,
      topicName: topic.name,
      ...topic,
    }))
    .filter((topic) =>
      selectedTopics.every((selected) => isNotEqual(topic, selected))
    );

  return {
    applicationList: applications.map((application) => ({
      label: application.appName,
      value: application.namespace,
    })),
    isLoadingApplications,
    selectedApplication,
    addSelectedTopic,
    removeSelectedTopic,
    setSelectedApplication,
    topics: availableTopics,
    selectedTopics,
  };
};
