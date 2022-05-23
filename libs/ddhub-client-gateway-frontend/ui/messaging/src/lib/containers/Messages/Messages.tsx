import { FC } from 'react';
import { MESSAGES_HEADERS } from '../../models/message-headers';
import { Messages as MessagesComponent } from '../../components';
import { useMessagesContainerEffects } from './Messages.effects';

export const Messages: FC = () => {
  const { actions } = useMessagesContainerEffects();
  return <MessagesComponent actions={actions} headers={MESSAGES_HEADERS} />;
};
