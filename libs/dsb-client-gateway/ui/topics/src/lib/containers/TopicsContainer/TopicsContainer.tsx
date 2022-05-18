import { FC } from 'react';
import { TopicsModalsProvider } from '../../context';
import { TopicsModalsCenter } from '../modals';
import { Topics } from '../../components';
import { routerConst } from '@dsb-client-gateway/ui/utils';

export interface TopicsContainerProps {
  versionHistoryUrl?: string;
  readonly?: boolean;
}

export const TopicsContainer: FC<TopicsContainerProps> = ({
  versionHistoryUrl = routerConst.VersionHistory,
  readonly = false,
}: TopicsContainerProps) => {
  return (
    <TopicsModalsProvider>
      <Topics readonly={readonly} versionHistoryUrl={versionHistoryUrl} />
      <TopicsModalsCenter />
    </TopicsModalsProvider>
  );
};
