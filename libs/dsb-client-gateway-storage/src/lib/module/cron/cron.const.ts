export enum CronJobType {
  DID_LISTENER = 'DID_LISTENER',
  CHANNEL_ROLES = 'CHANNEL_ROLES',
  TOPIC_REFRESH = 'TOPIC_REFRESH',
  SYMMETRIC_KEYS = 'SYMMETRIC_KEYS',
  ASSOCIATION_KEYS = 'ASSOCIATION_KEYS',
  PRIVATE_KEY = 'PRIVATE_KEY',
  APPLICATIONS_REFRESH = 'APPLICATIONS_REFRESH',
  HEARTBEAT = 'HEARTBEAT',
  FILE_CLEANER = 'FILE_CLEANER',
  EVENTS = 'EVENTS',
  ROLES_REFRESH = 'ROLES_REFRESH',
  MESSAGE_CLEANER = 'MESSAGE_CLEANER',
  CLIENTS = 'CLIENTS',
  ASSOCIATION_KEYS_SHARE = 'ASSOCIATION_KEYS_SHARE',
  MESSAGES_FETCH = 'MESSAGES_FETCH',
}

export enum CronStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
