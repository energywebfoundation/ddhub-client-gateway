import { BreadcrumbsType, mapUrlToBreadcrumbs } from './map-url-to-breadcrumbs';
import { useCachedApplications } from '@dsb-client-gateway/ui/api-hooks';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { useRouter } from 'next/router';

type TBreadcrumbs = { title: string; imageUrl?: string }[];

export const useBreadcrumbsEffects = (): TBreadcrumbs => {
  const router = useRouter();
  const { applicationsByNamespace } = useCachedApplications();

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
