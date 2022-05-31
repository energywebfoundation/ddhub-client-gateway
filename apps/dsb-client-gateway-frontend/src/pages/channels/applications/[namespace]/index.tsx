import { TopicsContainer } from '@ddhub-client-gateway-frontend/ui/topics';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export default function Topics() {
  return (
    <main>
      <TopicsContainer
        readonly={true}
        versionHistoryUrl={routerConst.ChannelTopicVersionHistory}
      />
    </main>
  );
}
