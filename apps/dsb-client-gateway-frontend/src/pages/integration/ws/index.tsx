import { Websocket } from '@ddhub-client-gateway-frontend/ui/integration';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../../utils/RouteGuard.effects';

export default function Ws() {
  return useRouteGuard(Websocket, UserRole.ADMIN);
}
