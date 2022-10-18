import { useState } from 'react';
import { Topic } from '../Topics.effects';

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
}

export const useSelectedTopicEffects = (
  {
    setSelectedApplication,
    topic,
    edit,
  }: SelectedTopicEffectsProps
) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [updatedTopic, setUpdatedTopic] = useState<Topic>(initialState);
  const [editTopic, setEditTopic] = useState<Topic>(initialState);

  const handleClose = () => {
    setExpanded(false);
  };

  const handleOpen = (event: any) => {
    const selectId = event.currentTarget.id;
    setSelectedApplication(topic.owner);

    setUpdatedTopic(initialState);
    setEditTopic(topic);
    setExpanded(selectId);
  };

  const handleSubmitForm = () => {
    edit(editTopic, updatedTopic);
    handleClose();
  };

  const handleClickTopic = (topic: Topic) => {
    setUpdatedTopic(topic);
  };

  return {
    expanded,
    updatedTopic,
    handleClose,
    handleOpen,
    handleSubmitForm,
    handleClickTopic,
  }
};
