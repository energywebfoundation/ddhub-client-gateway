import { SettingsContainer } from '@ddhub-client-gateway-frontend/ui/gateway-settings';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../utils/RouteGuard.effects';

export default function Index() {
  return useRouteGuard(SettingsContainer, UserRole.ADMIN);
}
