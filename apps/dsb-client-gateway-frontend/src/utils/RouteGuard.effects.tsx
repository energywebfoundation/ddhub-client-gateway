import { UserContext, UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import React, { FC, ReactElement, useContext } from 'react';
import { RestrictedRoute } from '../components/RestrictedRoute/RestrictedRoute';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useRouteGuard = <PageProps extends unknown>(
  guardedPage: FC,
  requiredRole?: UserRole,
  pageProps?: PageProps
): ReactElement => {
  const { authEnabled, userAuth } = useContext(UserContext);
  if (authEnabled === undefined) {
    return <></>;
  }
  if (authEnabled && requiredRole && userAuth.role !== requiredRole) {
    return <RestrictedRoute />;
  }
  return guardedPage(pageProps ?? {});
};
