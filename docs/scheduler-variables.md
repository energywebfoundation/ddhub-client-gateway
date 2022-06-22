# Scheduler env. variables

| KEY | TYPE | DEFAULT | DESCRIPTION | ALLOWED_VALUES | DEPENDENCY |
| --- | ---- | ------- | ----------- | -------------- | ---------- |
| DID_REGISTRY_ADDRESS | string | 0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af | DID Registry Address used for DID Listener |  |  |
| APPLICATION_CRON_SCHEDULE | string | */1 * * * * | How often should poll for applications data |  |  |
| APPLICATION_CRON_ENABLED | boolean | true | Should poll for applications data |  |  |
| CHANNEL_DID_CRON_SCHEDULE | string | */1 * * * * | How often should exchange channel roles for DIDs |  |  |
| CHANNEL_DID_CRON_ENABLED | boolean | true | Should poll for channel DIDs |  |  |
| SYMMETRIC_KEYS_CRON_SCHEDULE | string | */1 * * * * | How often should poll for symmetric keys |  |  |
| SYMMETRIC_KEYS_CRON_ENABLED | boolean | true | Should poll for symmetric keys |  |  |
| TOPICS_CRON_SCHEDULE | string | */1 * * * * | How often should poll for topics data |  |  |
| TOPICS_CRON_ENABLED | boolean | true | Should poll for topics data |  |  |
| FILE_CLEANER_CRON_SCHEDULE | string | */1 * * * * | How often should check and delete expired downloaded files |  |  |
| FILE_CLEANER_CRON_ENABLED | boolean | true | Should check for downloaded/expired files |  |  |
| PRIVATE_KEY_CRON_SCHEDULE | string | */11 * * * * | How often should check for private key changes in secrets engine |  |  |
| PRIVATE_KEY_CRON_ENABLED | boolean | true | Should check for private key changes |  |  |
| HEARTBEAT_CRON_SCHEDULE | string | 30 * * * * * | How often CRON JOB heartbeat should run |  |  |
| HEARTBEAT_CRON_ENABLED | boolean | true | Should run heartbeat |  |  |
| DOWNLOAD_FILES_LIFETIME | number | 30 | Specifies how long downloaded file should live (in minutes) |  |  |
| DID_LISTENER_ENABLED | boolean | true | Should listen for DID attributes changes |  |  |
| NODE_ENV | string |  | Node environment |  |  |
| DSB_BASE_URL | string | https://dsb-demo.energyweb.org | Message broker URL |  |  |
| UPLOAD_FILES_DIR | string | ./upload | Directory where we should store temporary files for upload |  |  |
| DOWNLOAD_FILES_DIR | string | ./download | Directory where we should store downloaded files for limited time |  |  |
| MTLS_ENABLED | boolean | true | Should enable mTLS |  |  |
| DB_NAME | string | local.db | SQLite database file name |  |  |
| CLIENT_ID | string | WS_CONSUMER | WS client id |  |  |
| MAX_RETRIES | number | 3 | Specifies maximum amount of retries for vulnerable methods |  |  |
| RETRY_FACTOR | number | 2 | Specifies retry factor (multiplier for timeout) for vulnerable methods |  |  |
| TIMEOUT | number | 1000 | Specifies timeout (how much app should wait before retries) for vulnerable methods |  |  |
| INTERNAL_EVENTS_TIMEOUT | number | 5 | How often internal events interval should execute (seconds) |  |  |
| USE_CACHE | boolean | true | Should use cache |  |  |
| SECRETS_ENGINE | string |  | Secrets engine to use | aws,vault,azure |  |
| VAULT_SECRET_PREFIX | string | ddhub/ | Vault path prefix for secrets |  | SECRETS_ENGINE == vault |
| VAULT_ENDPOINT | string |  | Vault path |  | SECRETS_ENGINE == vault |
| VAULT_TOKEN | string | root | Vault auth token |  | SECRETS_ENGINE == vault |
| AWS_SECRET_PREFIX | string | /ddhub/ | AWS Secret prefix |  | SECRETS_ENGINE == aws |
| AWS_REGION | string | us-east-1 | AWS Secrets Manager region |  | SECRETS_ENGINE == aws |
| OPENTELEMETRY_ENABLED | boolean | false |  |  |  |
| OTEL_IGNORED_ROUTES | string | health,api/v2/health | OTEL ignored routes |  | OPENTELEMETRY_ENABLED == true |
| OTEL_TRACING_URL | string | http://localhost:4318/v1/traces | OTEL collector tracing URL |  | OPENTELEMETRY_ENABLED == true |
| OTEL_SERVICE_NAME | string | ddhub-client-gateway | OTEL service name tag |  | OPENTELEMETRY_ENABLED == true |
| OTEL_ENVIRONMENT | string | local | OTEL environment name tag |  | OPENTELEMETRY_ENABLED == true |
| RPC_URL | string | https://volta-rpc.energyweb.org/ | EWF RPC URL |  |  |
| PARENT_NAMESPACE | string | dsb.apps.energyweb.iam.ewc | Parent namespace for IAM lookup |  |  |
| EVENT_SERVER_URL | string | identityevents-dev.energyweb.org | NATS URL for listening for DID roles updates |  |  |
| NATS_ENV_NAME | string | ewf-dev |  |  |  |
| CHAIN_ID | number | 73799 | Chain ID |  |  |
| CACHE_SERVER_URL | string | https://identitycache-dev.energyweb.org/v1 | SSI HUB url |  |  |
| CLAIM_MANAGER_ADDRESS | string | 0x5339adE9332A604A1c957B9bC1C6eee0Bcf7a031 | Overrides default IAM Client Lib claim manager address |  |  |
| CHAIN_NAME | string | VOLTA | Chain name |  |  |
| ENS_URL | string | https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org | Will be deprecated - same as RPC_URL |  |  |
