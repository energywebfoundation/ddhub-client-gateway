import { mapUrlToBreadcrumbs } from '../../utils/map-url-to-breadcrumbs';

export const getBreadcrumbsFromPathname = (pathName: string): string[] => {
  if (mapUrlToBreadcrumbs.has(pathName)) {
    return mapUrlToBreadcrumbs.get(pathName);
  }
  return [];
};
