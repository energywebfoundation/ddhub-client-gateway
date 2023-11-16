import { TopicVersionHistoryContainer } from '@ddhub-client-gateway-frontend/ui/channels';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../../../../utils/RouteGuard.effects';

export default function ChannelPage() {
  return useRouteGuard(TopicVersionHistoryContainer, UserRole.ADMIN);
}
