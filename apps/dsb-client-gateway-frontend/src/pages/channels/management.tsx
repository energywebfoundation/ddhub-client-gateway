import { ChannelsContainer } from '@ddhub-client-gateway-frontend/ui/channels';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function Channels() {
  return useRouteGuard(ChannelsContainer, UserRole.ADMIN);
}
