import { FC } from 'react';
import { Details } from './Details';
import { PostDetails } from './PostDetails';
import { NewMessage } from './NewMessage';
import { ViewMessage } from './ViewMessage';

export const ModalsCenter: FC = () => {
  return (
    <>
      <Details />
      <PostDetails />
      <NewMessage />
      <ViewMessage />
    </>
  );
};
