import { BreadcrumbsType, mapUrlToBreadcrumbs } from './map-url-to-breadcrumbs';
import { useCachedApplications } from '@dsb-client-gateway/ui/api-hooks';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { useRouter } from 'next/router';

export const useBreadcrumbsEffects = (): string[] => {
  const router = useRouter();
  const { applicationsByNamespace } = useCachedApplications();

  const pathName = router.pathname;

  if (mapUrlToBreadcrumbs.has(pathName)) {
    const breadcrumbs = mapUrlToBreadcrumbs.get(pathName) ?? [];
    return breadcrumbs.map((item) => {
      if (item.type === BreadcrumbsType.App) {
        return applicationsByNamespace[
          router.query[Queries.Namespace] as string
        ]?.appName;
      }

      return item.title;
    });
  }

  return [];
};
