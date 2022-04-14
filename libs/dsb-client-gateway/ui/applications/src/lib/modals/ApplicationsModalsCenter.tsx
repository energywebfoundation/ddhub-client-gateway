import { FC } from 'react';
import { CreateTopic } from './CreateTopic';
import { Cancel } from './Cancel';

export const ApplicationsModalsCenter: FC = () => {
  return (
    <>
      <CreateTopic />
      <Cancel />
    </>
  );
};
