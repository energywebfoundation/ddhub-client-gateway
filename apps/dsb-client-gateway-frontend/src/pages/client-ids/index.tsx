import { ClientIdList } from '@ddhub-client-gateway-frontend/ui/client-ids';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function ClientIds() {
  return useRouteGuard(ClientIdList, UserRole.ADMIN);
}
