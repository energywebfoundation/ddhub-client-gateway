import { FC } from 'react';
import { ModalProvider } from '../../context';
import { MessageOutbox } from '../MessageOutbox/MessageOutbox';
import { ModalsCenter } from '../modals/ModalsCenter';

export const MessageOutboxContainer: FC = () => {
  return (
    <ModalProvider>
      <MessageOutbox />
      <ModalsCenter />
    </ModalProvider>
  );
};
