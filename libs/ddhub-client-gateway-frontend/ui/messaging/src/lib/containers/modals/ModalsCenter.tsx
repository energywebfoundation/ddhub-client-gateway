import { FC } from 'react';
import { Details } from './Details';
import { PostDetails } from './PostDetails';
import { NewMessage } from './NewMessage';

export const ModalsCenter: FC = () => {
  return (
    <>
      <Details />
      <PostDetails />
      <NewMessage />
    </>
  );
};
