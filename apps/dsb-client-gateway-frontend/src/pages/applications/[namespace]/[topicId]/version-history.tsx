import { VersionHistoryContainer } from '@ddhub-client-gateway-frontend/ui/topics';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../../../utils/RouteGuard.effects';

export default function VersionHistory() {
  return useRouteGuard(VersionHistoryContainer, UserRole.ADMIN);
}
