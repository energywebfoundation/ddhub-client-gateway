import { KeyboardEvent, useState, useEffect } from 'react';
import { Topic } from '../Topics.effects';
import { FieldValues, useForm } from 'react-hook-form';
import { useAsyncDebounce } from 'react-table';

const initialState = {
  owner: '',
  topicName: '',
  topicId: '',
  appName: '',
};

export interface SelectedTopicEffectsProps {
  setSelectedApplication: (value: string) => void;
  edit?: (oldTopic: Topic, newTopic: Topic) => void;
  topic: Topic;
  topicsList: Topic[];
}

export const useSelectedTopicEffects = (
  {
    setSelectedApplication,
    topic,
    edit,
    topicsList,
  }: SelectedTopicEffectsProps
) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [updatedTopic, setUpdatedTopic] = useState<Topic>(initialState);
  const [editTopic, setEditTopic] = useState<Topic>(initialState);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (Array.isArray(topicsList)) {
      setFilteredTopics(topicsList);
    }
  }, [topicsList]);

  const { register, reset, watch } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  const handleReset = () => {
    onFilterChange('');
    reset({ search: '' });
  };

  const handleClose = () => {
    setExpanded(false);
    handleReset();
  };

  const handleOpen = (event: any) => {
    const selectId = event.currentTarget.id;
    setSelectedApplication(topic.owner);

    setUpdatedTopic(initialState);
    setEditTopic(topic);
    setExpanded(selectId);
    setFilteredTopics(topicsList);
  };

  const handleSubmitForm = () => {
    edit(editTopic, updatedTopic);
    handleClose();
  };

  const handleClickTopic = (topic: Topic) => {
    setUpdatedTopic(topic);
  };

  const onFilterChange = useAsyncDebounce((value: string) => {
    const keyword = value.toLowerCase();

    const filtered = topicsList.filter((topicItem) => {
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

    setFilteredTopics(filtered);
  }, 300);

  const field = {
    name: 'search',
    inputProps: {
      placeholder: 'Search topic name or tag',
    },
  };

  const inputProps = register(field.name);
  const value = watch(field.name);

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    e.stopPropagation();
  };

  return {
    expanded,
    updatedTopic,
    handleClose,
    handleOpen,
    handleSubmitForm,
    handleClickTopic,
    inputProps,
    value,
    field,
    handleReset,
    onFilterChange,
    filteredTopics,
    handleKeyDown,
  }
};
