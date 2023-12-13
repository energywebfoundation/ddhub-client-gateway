import { Applications } from '@ddhub-client-gateway-frontend/ui/applications';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function ListApplications() {
  console.log('trigger change');
  return useRouteGuard(Applications, UserRole.ADMIN);
}
