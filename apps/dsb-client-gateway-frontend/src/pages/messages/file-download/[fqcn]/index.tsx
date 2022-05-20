import { Channel } from '@ddhub-client-gateway-frontend/ui/messaging';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export default function Index() {
  return <Channel topicsUrl={routerConst.FileDownloadChannelTopic} />;
}
