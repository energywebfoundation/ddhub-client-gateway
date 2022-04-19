import { FC } from 'react';
import { CreateTopic } from './CreateTopic';
import { Cancel } from './Cancel';

export const TopicsModalsCenter: FC = () => {
  return (
    <>
      <CreateTopic />
      <Cancel />
    </>
  );
};
