import { FC } from 'react';
import { CreateTopic } from './CreateTopic';
import { UpdateTopic } from './UpdateTopic';

export const TopicsModalsCenter: FC = () => {
  return (
    <>
      <CreateTopic />
      <UpdateTopic />
    </>
  );
};
