import { Applications } from '@ddhub-client-gateway-frontend/ui/applications';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function ListApplications() {
  return useRouteGuard(Applications, UserRole.ADMIN);
}
