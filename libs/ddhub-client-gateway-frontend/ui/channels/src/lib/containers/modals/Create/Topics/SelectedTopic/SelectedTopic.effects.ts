import { KeyboardEvent, useState, useEffect, useRef, ChangeEvent } from 'react';
import { Topic } from '../Topics.effects';
import { FieldValues, useForm } from 'react-hook-form';
import { useAsyncDebounce } from 'react-table';
import { ResponseTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { getTopicKey } from '../../../../../utils';

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
  availableTopics: Topic[];
  saveResponse?: (topics: ResponseTopicDto[], selectedTopicId: string) => void;
  responseTopics?: ResponseTopicDto[];
}

export const useSelectedTopicEffects = ({
  setSelectedApplication,
  topic,
  edit,
  topicsList,
  availableTopics,
  saveResponse,
  responseTopics = [],
}: SelectedTopicEffectsProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [updatedTopic, setUpdatedTopic] = useState<Topic>(initialState);
  const [editTopic, setEditTopic] = useState<Topic>(initialState);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const [selected, setSelected] = useState<ResponseTopicDto[]>([]);
  const [panelId, setPanelId] = useState<string>('');
  const openIntentRef = useRef<'edit' | 'response'>('edit');

  useEffect(() => {
    if (Array.isArray(availableTopics)) {
      setFilteredTopics(availableTopics);
    }
  }, [availableTopics]);

  const { register, reset, watch } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  const handleReset = () => {
    onFilterChange('');
    reset({ search: '' });
  };

  const handleClose = () => {
    setIsResponse(false);
    setExpanded(false);
    openIntentRef.current = 'edit';
    handleReset();
  };

  useEffect(() => {
    setSelectedApplication(topic.owner);
    setEditTopic(topic);
  }, [topic]);

  const handleOpenEdit = (event?: { stopPropagation?: () => void }) => {
    event?.stopPropagation?.();
    openIntentRef.current = 'edit';
    setExpanded(panelId);
    setIsResponse(false);
    setUpdatedTopic(initialState);
    setFilteredTopics(availableTopics);
  };

  const handleOpenResponse = (event: { stopPropagation?: () => void }) => {
    event.stopPropagation?.();
    openIntentRef.current = 'response';
    setExpanded(panelId);
    setIsResponse(true);
    setFilteredTopics(topicsList);
    setSelected(responseTopics);
  };

  const handleSelectOpen = () => {
    if (openIntentRef.current === 'response') {
      return;
    }

    handleOpenEdit();
  };

  const handleSubmitForm = () => {
    if (isResponse) {
      const selectedTopicId = getTopicKey(editTopic);
      if (selectedTopicId) {
        saveResponse(selected, selectedTopicId);
      }
    } else {
      edit(editTopic, updatedTopic);
    }

    handleClose();
  };

  const handleClickTopic = (topic: Topic) => {
    setUpdatedTopic(topic);
  };

  const selectedIndex = (topicName: string) => {
    return selected.findIndex((topicItem) => topicItem.topicName === topicName);
  };

  const handleClickTopicCheckbox = (
    event: ChangeEvent<HTMLInputElement>,
    topic: Topic
  ) => {
    const selectedIdx = selectedIndex(topic.topicName);

    if (event.target.checked && selectedIdx === -1) {
      const selectedTopicId = getTopicKey(editTopic);
      if (!selectedTopicId) {
        return;
      }

      const respTopic = {
        topicName: topic.topicName,
        owner: topic.owner,
        responseTopicId: selectedTopicId,
      };

      setSelected([...selected, respTopic]);
    } else if (!event.target.checked && selectedIdx > -1) {
      const copy = [...selected];
      copy.splice(selectedIdx, 1);

      setSelected(copy);
    }
  };

  const onFilterChange = useAsyncDebounce((value: string) => {
    const keyword = value.toLowerCase();
    const listToFilter = isResponse ? topicsList : availableTopics;

    const filtered = listToFilter.filter((topicItem) => {
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
    handleSubmitForm,
    handleClickTopic,
    inputProps,
    value,
    field,
    handleReset,
    onFilterChange,
    filteredTopics,
    handleKeyDown,
    handleOpenResponse,
    handleOpenEdit,
    handleSelectOpen,
    isResponse,
    handleClickTopicCheckbox,
    selected,
    selectedIndex,
    setPanelId,
  };
};
