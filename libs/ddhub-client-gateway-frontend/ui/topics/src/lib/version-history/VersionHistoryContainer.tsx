import { TopicsModalsProvider } from '../context';
import { TopicsModalsCenter } from '../containers';
import { VersionHistory } from './components/VersionHistory/VersionHistory';

export function VersionHistoryContainer() {
  return (
    <TopicsModalsProvider>
      <VersionHistory />
      <TopicsModalsCenter />
    </TopicsModalsProvider>
  );
}
