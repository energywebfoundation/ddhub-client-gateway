import { FC } from 'react';
import { CreateTopic } from './CreateTopic';
import { UpdateTopic } from './UpdateTopic';
import { ViewTopicDetails  } from './ViewTopicDetails';

export const TopicsModalsCenter: FC = () => {
  return (
    <>
      <CreateTopic />
      <UpdateTopic />
      <ViewTopicDetails />
    </>
  );
};
