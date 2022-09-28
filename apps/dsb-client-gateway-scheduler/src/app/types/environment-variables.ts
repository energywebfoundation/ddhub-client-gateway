import * as Joi from 'joi';

export const SCHEDULER_ENVS = Joi.object({
  DID_REGISTRY_ADDRESS: Joi.string()
    .default('0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af')
    .description('DID Registry Address used for DID Listener'),
  APPLICATION_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should poll for applications data'),
  APPLICATION_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should poll for applications data'),
  CLIENTS_CRON_SCHEDULE: Joi.string()
    .default('*/5 * * * *')
    .description('How often should check for outdated clients'),
  CLIENTS_CRON_ENABLED: Joi.string()
    .default(true)
    .description('Should check for outdated clients'),
  CHANNEL_DID_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should exchange channel roles for DIDs'),
  CHANNEL_DID_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should poll for channel DIDs'),
  MESSAGE_CLEANER_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should clean messages data'),
  MESSAGE_CLEANER_CRON_SCHEDULE: Joi.string()
    .default('*/30 * * * *')
    .description('How often should clean messages data'),
  CLIENT_EXPIRATION_DAYS: Joi.number()
    .positive()
    .default(30)
    .description('Time to live of a client'),
  SYMMETRIC_KEYS_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should poll for symmetric keys'),
  SYMMETRIC_KEYS_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should poll for symmetric keys'),
  TOPICS_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should poll for topics data'),
  TOPICS_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should poll for topics data'),
  FILE_CLEANER_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should check and delete expired downloaded files'),
  FILE_CLEANER_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should check for downloaded/expired files'),
  ROLES_REFRESH_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should check for DID roles changes'),
  ROLES_REFRESH_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should check for DID roles changes'),
  PRIVATE_KEY_CRON_SCHEDULE: Joi.string()
    .default('*/11 * * * *')
    .description(
      'How often should check for private key changes in secrets engine'
    ),
  PRIVATE_KEY_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should check for private key changes'),
  HEARTBEAT_CRON_SCHEDULE: Joi.string()
    .default('30 * * * * *')
    .description('How often CRON JOB heartbeat should run'),
  HEARTBEAT_CRON_ENABLED: Joi.boolean()
    .default(true)
    .description('Should run heartbeat'),
  DOWNLOAD_FILES_LIFETIME: Joi.number()
    .positive()
    .default(30)
    .description('Specifies how long downloaded file should live (in minutes)'),
  DID_LISTENER_ENABLED: Joi.boolean()
    .default(true)
    .description('Should listen for DID attributes changes'),
});
