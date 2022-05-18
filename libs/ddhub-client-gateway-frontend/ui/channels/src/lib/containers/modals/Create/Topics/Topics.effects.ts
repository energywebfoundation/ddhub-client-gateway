import {
  useApplications,
  useTopics,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useState } from 'react';
import { differenceBy } from 'lodash';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface Topic extends Partial<GetTopicDto> {
  owner: string;
  topicName: string;
}

export const useTopicsEffects = (topicsState: Topic[]) => {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(topicsState);
  const { applications, isLoading: isLoadingApplications } =
    useApplications('user');

  const { topics } = useTopics(selectedApplication);

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
    setSelectedTopics(selectedTopics.filter((topic) => topic.id !== data.id));
  };

  const availableTopics: Topic[] = differenceBy(
    topics,
    selectedTopics,
    'id'
  ).map((topic: GetTopicDto) => ({
    label: topic.name,
    topicName: topic.name,
    ...topic,
  }));

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
