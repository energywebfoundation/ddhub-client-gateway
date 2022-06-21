import {
  useApplications,
  useTopics,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useState } from 'react';
import { differenceBy } from 'lodash';
import {
  GetTopicDto,
  GetTopicDtoSchemaType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelType } from '../../../../models';
import { getChannelType } from '../../../../utils';
import { TopicsProps } from './Topics';

const topicsFilters: Record<ChannelType, GetTopicDtoSchemaType[]> = {
  [ChannelType.Messaging]: [GetTopicDtoSchemaType.JSD7],
  [ChannelType.FileTransfer]: [
    GetTopicDtoSchemaType.CSV,
    GetTopicDtoSchemaType.TSV,
    GetTopicDtoSchemaType.XML,
  ],
};

export interface Topic extends Partial<GetTopicDto> {
  owner: string;
  topicName: string;
}

export const useTopicsEffects = (channelValues: TopicsProps['channelValues']) => {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(
    channelValues.topics
  );
  const { applications, isLoading: isLoadingApplications } =
    useApplications('user');

  const { topics } = useTopics({ owner: selectedApplication });

  const channelType = getChannelType(channelValues.channelType);
  const filters = topicsFilters[channelType as ChannelType];
  const filteredTopics = topics.filter(
    (item) => filters.includes(item.schemaType)
  );

  const addSelectedTopic = (selectedTopic: Topic) => {
    const exist =
    filteredTopics.findIndex((topic) => topic.name === selectedTopic.name) >
    -1;
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
    filteredTopics,
    selectedTopics,
    'id'
  ).map((topic: GetTopicDto) => ({
    label: topic.name,
    topicName: topic.name,
    ...topic,
  }));

  const filterTopics = (options: Topic[], state: any) => {
    const keyword = state.inputValue.toLowerCase();

    return options.filter((topicItem) => {
      const topicName = topicItem['topicName'].toLowerCase();
      const matchedTopics = topicName.includes(keyword);
      let matchedTags = -1;

      if (!matchedTopics) {
        matchedTags = topicItem['tags'].findIndex((item) => {
          const tagItem = item.toLowerCase();
          return tagItem.includes(keyword);
        });
      }

      return matchedTopics || matchedTags !== -1;
    });
  }

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
    filterTopics,
  };
};
