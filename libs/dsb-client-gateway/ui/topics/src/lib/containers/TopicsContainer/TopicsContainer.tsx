import { FC } from 'react';
import { TopicsModalsProvider } from '../../context';
import { TopicsModalsCenter } from '../modals';
import { Topics } from '../../components';
import { routerConst } from '@dsb-client-gateway/ui/utils';

export interface TopicsContainerProps {
  versionHistoryUrl?: string;
}

export const TopicsContainer: FC<TopicsContainerProps> = ({
  versionHistoryUrl = routerConst.VersionHistory,
}: TopicsContainerProps) => {
  return (
    <TopicsModalsProvider>
      <Topics versionHistoryUrl={versionHistoryUrl} />
      <TopicsModalsCenter />
    </TopicsModalsProvider>
  );
};
