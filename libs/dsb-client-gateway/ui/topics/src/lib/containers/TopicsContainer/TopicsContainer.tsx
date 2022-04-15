import { FC } from 'react';
import { TopicsModalsProvider } from '../../context';
import { TopicsModalsCenter } from '../modals';
import { Topics  } from '../../components';

export const TopicsContainer: FC = () => {
  return (
    <TopicsModalsProvider>
      <Topics />
      <TopicsModalsCenter />
    </TopicsModalsProvider>
  );
};
