import {
  useApplications,
  useTopics,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useState, useEffect } from 'react';
import { differenceBy } from 'lodash';
import {
  GetTopicDto,
  GetTopicDtoSchemaType,
  ResponseTopicDto,
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
  topicId?: string;
  appName?: string;
}

export interface Application {
  label: string;
  topicsCount: number;
  value: string;
}

const initialState = {
  label: '',
  topicsCount: 0,
  value: '',
};

export const useTopicsEffects = (
  channelValues: TopicsProps['channelValues']
) => {
  const [selectedApplication, setSelectedApplication] =
    useState<Application>(initialState);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(
    channelValues.topics
  );
  const [responseTopics, setResponseTopics] = useState<ResponseTopicDto[]>(
    channelValues.responseTopics
  );
  const { applications, isLoading: isLoadingApplications } =
    useApplications('user');
  const [recent, setRecent] = useState('');
  const [topicInputValue, setTopicInputValue] = useState('');
  const [topicValue, setTopicValue] = useState<string | null>(null);

  const { topics, topicsLoading } = useTopics({
    owner: selectedApplication.value,
  });

  const channelType = getChannelType(channelValues.channelType);
  const filters = topicsFilters[channelType as ChannelType];
  const filteredTopics = topics.filter((item) =>
    filters.includes(item.schemaType)
  );

  useEffect(() => {
    setTopicInputValue('');
  }, [recent]);

  const addSelectedTopic = (selectedTopic: Topic) => {
    const exist =
      filteredTopics.findIndex((topic) => topic.name === selectedTopic.name) >
      -1;
    if (!exist) {
      return;
    }
    setRecent(selectedTopic.name);
    setSelectedTopics([
      {
        ...selectedTopic,
        owner: selectedApplication.value,
        topicName: selectedTopic.name as string,
        appName: selectedApplication.label,
      },
      ...selectedTopics,
    ]);
    setTopicValue('');
  };

  const getFilteredTopics = (data: Topic) => {
    const filteredTopic = selectedTopics.filter((topic) => {
      const topicId = topic.id || topic.topicId;

      if (data.topicId) {
        return data.topicId !== topicId;
      }
      return data.id !== topicId;
    });

    return filteredTopic;
  };

  const filterResponseTopics = (topicId: string) => {
    const respTopics = responseTopics.filter((resp) => {
      return resp.responseTopicId !== topicId;
    });

    return respTopics;
  };

  const resetResponseTopics = (topicId: string) => {
    const respTopics = filterResponseTopics(topicId);

    setResponseTopics(respTopics);
  };

  const removeSelectedTopic = (data: Topic) => {
    const filteredTopic = getFilteredTopics(data);
    setRecent('');
    setSelectedTopics(filteredTopic);
    resetResponseTopics(data.id);
  };

  const updateSelectedTopic = (oldTopic: Topic, newTopic: Topic) => {
    const filteredTopic = getFilteredTopics(oldTopic);
    setRecent(newTopic.topicName);

    setSelectedTopics([
      {
        ...newTopic,
        appName: oldTopic.appName,
      },
      ...filteredTopic,
    ]);

    resetResponseTopics(oldTopic.id);
  };

  const saveTopicResponse = (
    topics: ResponseTopicDto[],
    selectedTopicId: string
  ) => {
    if (topics.length) {
      const respTopics = filterResponseTopics(selectedTopicId);

      setResponseTopics(respTopics.concat(topics));
    } else {
      resetResponseTopics(selectedTopicId);
    }
  };

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
  };

  return {
    applicationList: applications.map((application) => ({
      label: application.appName,
      value: application.namespace,
      topicsCount: application.topicsCount,
    })),
    isLoadingApplications,
    selectedApplication,
    addSelectedTopic,
    removeSelectedTopic,
    setSelectedApplication,
    updateSelectedTopic,
    topics: availableTopics,
    selectedTopics,
    filterTopics,
    topicsLoading,
    filters,
    recent,
    topicInputValue,
    setTopicInputValue,
    topicValue,
    saveTopicResponse,
    // responseTopics,
  };
};
