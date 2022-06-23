import {
  ApplicationRefresh,
  ChannelRoles, FileCleaner,
  SymmetricKeys,
  TopicRefresh,
} from '@ddhub-client-gateway-frontend/ui/core';

export const schedulerIconMap = new Map()
  .set('APPLICATIONS_REFRESH', ApplicationRefresh)
  .set('CHANNEL_ROLES', ChannelRoles)
  .set('SYMMETRIC_KEYS', SymmetricKeys)
  .set('FILE_CLEANER', FileCleaner)
  .set('TOPIC_REFRESH', TopicRefresh);
