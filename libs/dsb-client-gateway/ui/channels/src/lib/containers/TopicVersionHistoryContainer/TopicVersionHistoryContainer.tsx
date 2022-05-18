import { FC } from 'react';
import { ModalProvider } from '../../context';
import { TopicVersionHistory } from '../../containers/TopicVersionHistory';
import { ModalCenter } from '../modals/ModalCenter/ModalCenter';

export const TopicVersionHistoryContainer: FC = () => {
  return (
    <ModalProvider>
      <TopicVersionHistory />
      <ModalCenter />
    </ModalProvider>
  );
};
