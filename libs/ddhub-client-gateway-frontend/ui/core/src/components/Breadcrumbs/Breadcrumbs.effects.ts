import { BreadcrumbsType, mapUrlToBreadcrumbs } from './map-url-to-breadcrumbs';
import { useCachedApplications } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries, routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';

type TBreadcrumbs = { title: string; imageUrl?: string }[];

export const useBreadcrumbsEffects = (): TBreadcrumbs => {
  const router = useRouter();

  const getUsedRoleForApplication = router.pathname.includes(
    routerConst.Channels
  )
    ? 'user'
    : undefined;
  const { applicationsByNamespace } = useCachedApplications(
    getUsedRoleForApplication
  );

  const pathName = router.pathname;

  if (mapUrlToBreadcrumbs.has(pathName)) {
    const breadcrumbs = mapUrlToBreadcrumbs.get(pathName) ?? [];
    return breadcrumbs.map((item) => {
      if (item.type === BreadcrumbsType.App) {
        const application =
          applicationsByNamespace[router.query[Queries.Namespace] as string];
        return {
          imageUrl: application?.logoUrl,
          title: application?.appName,
        };
      }

      return {
        title: item.title,
      };
    });
  }

  return [];
};
