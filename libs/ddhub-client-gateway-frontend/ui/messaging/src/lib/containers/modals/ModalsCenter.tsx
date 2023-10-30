import { FC } from 'react';
import { Details } from './Details';
import { PostDetails } from './PostDetails';
import { MessageInboxDetails } from './MessageInboxDetails';

export const ModalsCenter: FC = () => {
  return (
    <>
      <Details />
      <PostDetails />
      <MessageInboxDetails />
    </>
  );
};
