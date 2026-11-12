import { UserContext, UserRole } from '@ddhub-client-gateway-frontend/ui/login';
import React, { FC, ReactElement, useContext } from 'react';
import { RestrictedRoute } from '../components/RestrictedRoute/RestrictedRoute';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useRouteGuard = <PageProps extends unknown>(
  guardedPage: FC,
  requiredRole?: UserRole | UserRole[],
  pageProps?: PageProps
): ReactElement => {
  const { authEnabled, userAuth } = useContext(UserContext);

  // Show loading state while auth is being determined
  if (authEnabled === undefined) {
    return <></>;
  }

  // If auth is disabled, allow access
  if (!authEnabled) {
    return guardedPage(pageProps ?? {});
  }

  // If no role requirement, allow access
  if (!requiredRole) {
    return guardedPage(pageProps ?? {});
  }

  // Check if user has required role
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(userAuth.role as UserRole)
    : userAuth.role === requiredRole;

  // Allow access if user has required role, otherwise show restricted route
  return hasRequiredRole ? guardedPage(pageProps ?? {}) : <RestrictedRoute />;
};
