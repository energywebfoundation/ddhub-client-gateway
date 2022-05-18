export enum Queries {
  Namespace = 'namespace',
  Owner = 'owner',
  TopicId = 'topicId',
  TopicName = 'topicName',
  FQCN = 'fqcn',
  MessageId = 'messageId'
}

export const routerConst = {
  InitialPage: '/',
  Dashboard: '/dashboard',
  GatewaySettings: '/gateway-settings',
  AppsAndTopics: '/applications',
  Topics: `/applications/[${Queries.Namespace}]`,
  MyAppsAndTopics: '/my-applications',
  MyAppsTopics: `/my-applications/[${Queries.Namespace}]`,
  Channels: '/channels',
  Channel: `/channels/[${Queries.FQCN}]`,
  IntegrationAPIs: '/integration',
  LargeDataMessagingFileUpload: '/messages/large-file-upload',
  LargeDataMessagingFileDownload: '/messages/large-file-download',
  LargeFileDownloadChannel: `/messages/large-file-download/[${Queries.FQCN}]`,
  LargeFileDownloadChannelTopic: `/messages/large-file-download/[${Queries.FQCN}]/[${Queries.TopicId}]`,
  DataMessagingFileUpload: '/messages/file-upload',
  DataMessagingFileDownload: '/messages/file-download',
  VersionHistory: `/applications/[${Queries.Namespace}]/[${Queries.TopicId}]/version-history`,
  ChannelTopicVersionHistory: `/channels/[${Queries.Owner}]/[${Queries.TopicId}]/version-history`,
};
