import { FC } from 'react';
import { Messages } from '../../components';
import { LARGE_MESSAGES_HEADERS } from '../../models/message-headers';

export const LargeMessagesContainer: FC = () => {
  return <Messages headers={LARGE_MESSAGES_HEADERS} />;
};
