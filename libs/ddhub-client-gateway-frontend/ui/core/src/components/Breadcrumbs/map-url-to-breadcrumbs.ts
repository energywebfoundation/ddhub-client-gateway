import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export enum BreadcrumbsType {
  App = 'namespace',
}

export interface Breadcrumb {
  title: string;
  type?: BreadcrumbsType;
  path?: string;
}

export const mapUrlToBreadcrumbs = new Map<string, Breadcrumb[]>()
  .set(routerConst.Dashboard, [{ title: 'Dashboard' }])
  .set(routerConst.GatewaySettings, [
    { title: 'Gateway settings' },
    { title: 'Gateway Settings' },
  ])
  .set(routerConst.TopicManagement, [
    { title: 'Apps and Topics' },
    { title: 'Apps and Topics' },
  ])
  .set(routerConst.Topics, [
    { type: BreadcrumbsType.App, title: '' },
    { title: 'Apps and Topics', path: routerConst.TopicManagement },
    { title: 'Topics' },
  ])
  .set(routerConst.ChannelApps, [
    { title: 'My Apps and Topics' },
    { title: 'My Apps and Topics' },
  ])
  .set(routerConst.ChannelTopics, [
    { type: BreadcrumbsType.App, title: '' },
    { title: 'My Apps and Topics', path: routerConst.ChannelApps },
    { title: 'Topics' },
  ])
  .set(routerConst.VersionHistory, [
    { type: BreadcrumbsType.App, title: '' },
    { title: 'Apps and Topics', path: routerConst.TopicManagement },
    { title: 'Topics', path: routerConst.Topics },
    { title: 'Version history' },
  ])
  .set(routerConst.ChannelTopicVersionHistory, [
    { type: BreadcrumbsType.App, title: '' },
    { title: 'Apps and Topics', path: routerConst.ChannelApps },
    { title: 'Topics', path: routerConst.ChannelTopics },
    { title: 'Version history' },
  ])
  .set(routerConst.ChannelsManagement, [
    { title: 'Channels management' },
    { title: 'Channels management' },
  ])
  .set(routerConst.IntegrationAPIs, [
    { title: 'Integration APIs' },
    { title: 'Integration APIs' },
  ])
  .set(routerConst.LargeDataMessagingFileDownload, [
    { title: 'Large data messaging file download' },
    { title: 'Large data messaging file download' },
  ])
  .set(routerConst.LargeFileDownloadChannel, [
    { title: 'Large data messaging file download' },
    {
      title: 'Large data messaging file download',
      path: routerConst.LargeDataMessagingFileDownload,
    },
    { title: 'Channel topics' },
  ])
  .set(routerConst.LargeFileDownloadChannelTopic, [
    { title: 'Large data messaging file download' },
    {
      title: 'Large data messaging file download',
      path: routerConst.LargeDataMessagingFileDownload,
    },
    { title: 'Channel topics', path: routerConst.LargeFileDownloadChannel },
    { title: 'Messages' },
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
  ])
  .set(routerConst.FileDownloadChannel, [
    { title: 'Data messaging file upload' },
    {
      title: 'Data messaging file upload',
      path: routerConst.DataMessagingFileDownload,
    },
    { title: 'Channel topics' },
  ])
  .set(routerConst.FileDownloadChannelTopic, [
    { title: 'Data messaging file upload' },
    {
      title: 'Data messaging file upload',
      path: routerConst.DataMessagingFileDownload,
    },
    { title: 'Channel topics', path: routerConst.FileDownloadChannel },
    { title: 'Messages' },
  ])
  .set(routerConst.WS, [
    { title: 'Integration APIs' },
    { title: 'Integration APIs', path: routerConst.IntegrationAPIs },
    { title: 'Websocket API' },
  ])
  .set(routerConst.ClientIds, [
    { title: 'Client Subscriptions' },
    { title: 'Client Subscriptions' },
  ])
  .set(routerConst.MessageInbox, [
    { title: 'Message Box' },
    { title: 'Channel List' },
  ]);
