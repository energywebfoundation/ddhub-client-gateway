import { UsersContainer } from '@ddhub-client-gateway-frontend/ui/users';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function UsersPage() {
  return useRouteGuard(UsersContainer, UserRole.SUPERADMIN);
}
