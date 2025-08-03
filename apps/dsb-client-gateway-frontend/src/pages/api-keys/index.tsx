import { ApiKeysContainer } from '@ddhub-client-gateway-frontend/ui/api-keys';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function APIKeys() {
  return useRouteGuard(ApiKeysContainer, UserRole.ADMIN);
}
