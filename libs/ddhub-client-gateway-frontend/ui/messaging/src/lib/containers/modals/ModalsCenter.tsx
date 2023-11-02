import { FC } from 'react';
import { Details } from './Details';
import { PostDetails } from './PostDetails';
import { MessageInboxDetails } from './MessageInboxDetails';
import { NewMessage } from './NewMessage';
import { ViewMessage } from './ViewMessage';
import { AddUpdateContact } from './AddUpdateContact';

export const ModalsCenter: FC = () => {
  return (
    <>
      <Details />
      <PostDetails />
      <MessageInboxDetails />
      <NewMessage />
      <ViewMessage />
      <AddUpdateContact />
    </>
  );
};
