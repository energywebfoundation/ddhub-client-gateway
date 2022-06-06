import { Applications } from '@ddhub-client-gateway-frontend/ui/applications';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export default function ListApplications() {
  return (
    <main>
      <Applications role="user" topicUrl={routerConst.ChannelTopics} />
    </main>
  );
}
