import {
  Applications,
  ApplicationsProps,
} from '@ddhub-client-gateway-frontend/ui/applications';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../../utils/RouteGuard.effects';

export default function ListApplications() {
  return useRouteGuard<ApplicationsProps>(Applications, UserRole.ADMIN, {
    role: 'user',
    topicUrl: routerConst.ChannelTopics,
  });
}
