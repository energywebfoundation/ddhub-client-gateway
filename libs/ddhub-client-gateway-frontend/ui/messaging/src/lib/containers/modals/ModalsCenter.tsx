import { FC } from 'react';
import { Details } from './Details';
import { PostDetails } from './PostDetails';
import { MessageInboxDetails } from './MessageInboxDetails';
import { AddUpdateContact } from './AddUpdateContact';

export const ModalsCenter: FC = () => {
  return (
    <>
      <Details />
      <PostDetails />
      <MessageInboxDetails />
      <AddUpdateContact />
    </>
  );
};
