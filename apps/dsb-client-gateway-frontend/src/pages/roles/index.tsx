import { RolesContainer } from '@ddhub-client-gateway-frontend/ui/roles';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function RolesPage() {
  return useRouteGuard(RolesContainer, [UserRole.ADMIN, UserRole.SUPERADMIN]);
}
