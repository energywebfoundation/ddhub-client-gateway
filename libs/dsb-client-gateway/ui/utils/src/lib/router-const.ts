export enum Queries {
  Namespace = 'namespace',
  Owner = 'owner',
  TopicId = 'topicId',
  FQCN = 'fqcn',
}

export const routerConst = {
  InitialPage: '/',
  Dashboard: '/dashboard',
  GatewaySettings: '/gateway-settings',
  AppsAndTopics: '/applications',
  Topics: `/applications/[${Queries.Namespace}]`,
  ChannelApps: '/channels/applications',
  ChannelTopics: `/channels/applications/[${Queries.Namespace}]`,
  Channels: '/channels',
  ChannelsManagement: '/channels/management',
  Channel: `/channels/[${Queries.FQCN}]`,
  IntegrationAPIs: '/integration',
  LargeDataMessagingFileUpload: '/messages/large-file-upload',
  LargeDataMessagingFileDownload: '/messages/large-file-download',
  LargeFileDownloadChannel: `/messages/large-file-download/[${Queries.FQCN}]`,
  DataMessagingFileUpload: '/messages/file-upload',
  DataMessagingFileDownload: '/messages/file-download',
  VersionHistory: `/applications/[${Queries.Namespace}]/[${Queries.TopicId}]/version-history`,
  ChannelTopicVersionHistory: `/channels/[${Queries.Namespace}]/[${Queries.TopicId}]/version-history`,
};
