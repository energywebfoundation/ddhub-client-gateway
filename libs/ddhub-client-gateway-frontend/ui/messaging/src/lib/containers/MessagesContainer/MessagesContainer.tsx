import { FC } from 'react';
import { Messages } from '../Messages';
import { ModalsCenter } from '../modals/ModalsCenter';
import { ModalProvider } from '../../context';

export const MessagesContainer: FC = () => {
  return (
    <ModalProvider>
      <Messages />
      <ModalsCenter />
    </ModalProvider>
  );
};
