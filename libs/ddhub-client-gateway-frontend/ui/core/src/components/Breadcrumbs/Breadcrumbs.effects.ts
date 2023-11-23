import { BreadcrumbsType, mapUrlToBreadcrumbs } from './map-url-to-breadcrumbs';
import { useCachedApplications } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries, routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { replace } from 'lodash';

type TBreadcrumbs = { title: string; imageUrl?: string, path?: string }[];

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
    const application =
      applicationsByNamespace[router.query[Queries.Namespace] as string];

    return breadcrumbs.map((item) => {
      if (item.type === BreadcrumbsType.App) {
        return {
          imageUrl: application?.logoUrl,
          title: application?.appName,
        };
      }

      let itemPath = item.path || '';

      if (itemPath) {
        const fqcn = router.query[Queries.FQCN] as string;
        const topicId = router.query[Queries.TopicId] as string;

        if (application?.namespace) {
          itemPath = replace(itemPath, `[${Queries.Namespace}]`, application?.namespace);
        }

        if (fqcn) {
          itemPath = replace(itemPath, `[${Queries.FQCN}]`, fqcn);
        }

        if (topicId) {
          itemPath = replace(itemPath, `[${Queries.TopicId}]`, topicId);
        }
      }

      return {
        title: item.title,
        path: itemPath,
      };
    });
  }

  return [];
};
