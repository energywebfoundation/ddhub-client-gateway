import {
  TopicsContainer,
  TopicsContainerProps,
} from '@ddhub-client-gateway-frontend/ui/topics';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import { useRouteGuard } from '../../../../utils/RouteGuard.effects';

export default function Topics() {
  return useRouteGuard<TopicsContainerProps>(TopicsContainer, UserRole.ADMIN, {
    readonly: true,
    versionHistoryUrl: routerConst.ChannelTopicVersionHistory,
  });
}
