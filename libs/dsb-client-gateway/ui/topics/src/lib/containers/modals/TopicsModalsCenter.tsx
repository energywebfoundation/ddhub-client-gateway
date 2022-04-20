import { FC } from 'react';
import { CreateTopic } from './CreateTopic';
import { UpdateTopic } from './UpdateTopic';
import { Cancel } from './Cancel';

export const TopicsModalsCenter: FC = () => {
  return (
    <>
      <CreateTopic />
      <UpdateTopic />
      <Cancel />
    </>
  );
};
