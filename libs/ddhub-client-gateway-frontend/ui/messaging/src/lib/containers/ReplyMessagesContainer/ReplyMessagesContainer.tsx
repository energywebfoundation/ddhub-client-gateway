import { FC } from 'react';
import { ModalProvider } from '../../context';
import { ModalsCenter } from '../modals/ModalsCenter';
import { ReplyMessages } from '../ReplyMessages/ReplyMessages';

export const ReplyMessagesContainer: FC = () => {
  return (
    <ModalProvider>
      <ReplyMessages />
      <ModalsCenter />
    </ModalProvider>
  );
};
