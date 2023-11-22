import { TopicsContainer } from '@ddhub-client-gateway-frontend/ui/topics';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../../utils/RouteGuard.effects';
export default function Topics() {
  return useRouteGuard(TopicsContainer, UserRole.ADMIN);
}
