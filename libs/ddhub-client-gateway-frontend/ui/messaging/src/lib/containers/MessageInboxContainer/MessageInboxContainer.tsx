import { FC } from 'react';
import { ModalProvider } from '../../context';
import { MessageInbox } from '../MessageInbox';
import { ModalsCenter } from '../modals/ModalsCenter';

export const MessageInboxContainer: FC = () => {
  return (
    <ModalProvider>
      <MessageInbox />
      <ModalsCenter />
    </ModalProvider>
  );
};
