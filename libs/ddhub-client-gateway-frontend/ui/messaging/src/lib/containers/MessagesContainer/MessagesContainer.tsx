import { FC } from 'react';
import { Messages, MessageProps } from '../Messages';
import { ModalsCenter } from '../modals/ModalsCenter';
import { ModalProvider } from '../../context';

export const MessagesContainer: FC<MessageProps> = (props) => {
  return (
    <ModalProvider>
      <Messages {...props} />
      <ModalsCenter />
    </ModalProvider>
  );
};
