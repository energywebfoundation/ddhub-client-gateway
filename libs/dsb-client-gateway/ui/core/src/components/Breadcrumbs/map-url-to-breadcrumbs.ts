import { routerConst } from '@dsb-client-gateway/ui/utils';

export enum BreadcrumbsType {
  App = 'namespace',
}

export interface Breadcrumb {
  title: string;
  type?: BreadcrumbsType;
}

export const mapUrlToBreadcrumbs = new Map<string, Breadcrumb[]>()
  .set(routerConst.Dashboard, [{ title: 'Dashboard' }])
  .set(routerConst.GatewaySettings, [
    { title: 'Dashboard' },
    { title: 'Gateway Settings' },
  ])
  .set(routerConst.AppsAndTopics, [
    { title: 'Apps and Topics' },
    { title: 'Apps and Topics' },
  ])
  .set(routerConst.Topics, [
    { type: BreadcrumbsType.App, title: '' },
    { title: 'Apps and Topics' },
    { title: 'Topics' },
  ])
  .set(routerConst.VersionHistory, [
    { type: BreadcrumbsType.App, title: '' },
    { title: 'Apps and Topics' },
    { title: 'Topics' },
    { title: 'Version history'}
  ])
  .set(routerConst.Channels, [{ title: 'Channels' }, { title: 'Channels' }])
  .set(routerConst.IntegrationAPIs, [
    { title: 'Integration APIs' },
    { title: 'Integration APIs' },
  ])
  .set(routerConst.LargeDataMessagingFileDownload, [
    { title: 'Large data messaging file download' },
    { title: 'Large data messaging file download' },
  ])
  .set(routerConst.LargeDataMessagingFileUpload, [
    { title: 'Large data messaging file upload' },
    { title: 'Large data messaging file upload' },
  ])
  .set(routerConst.DataMessagingFileDownload, [
    { title: 'Data messaging file download' },
    { title: 'Data messaging file download' },
  ])
  .set(routerConst.DataMessagingFileUpload, [
    { title: 'Data messaging file upload' },
    { title: 'Data messaging file upload' },
  ]);
