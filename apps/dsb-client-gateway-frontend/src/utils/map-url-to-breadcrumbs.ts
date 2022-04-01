import { routerConst } from '@dsb-client-gateway/dsb-client-gateway/ui/utils';

export const mapUrlToBreadcrumbs = new Map<string, string[]>()
  .set(routerConst.Dashboard, ['Dashboard'])
  .set(routerConst.GatewaySettings, ['Dashboard', 'Gateway Settings'])
  .set(routerConst.AppsAndTopics, ['Apps and Topics', 'Apps and Topics'])
  .set(routerConst.Channels, ['Channels', 'Channels'])
  .set(routerConst.IntegrationAPIs, ['Integration APIs', 'Integration APIs'])
  .set(routerConst.LargeDataMessagingFileDownload, ['Large data messaging file download', 'Large data messaging file download'])
  .set(routerConst.LargeDataMessagingFileUpload, ['Large data messaging file upload', 'Large data messaging file upload'])
  .set(routerConst.DataMessagingFileDownload, ['Data messaging file download', 'Data messaging file download'])
  .set(routerConst.DataMessagingFileUpload, ['Data messaging file upload', 'Data messaging file upload'])
