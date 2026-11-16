# Scheduler env. variables

| KEY | TYPE | DEFAULT | DESCRIPTION | ALLOWED_VALUES | DEPENDENCY |
| --- | ---- | ------- | ----------- | -------------- | ---------- |
| DID_REGISTRY_ADDRESS | string | 0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af | DID Registry Address used for DID Listener |  |  |
| ASSOCIATION_KEYS_CRON_ENABLED | boolean | false | Should generate association keys |  |  |
| ASSOCIATION_KEYS_CRON_SCHEDULE | string | */1 * * * * | How often should generate association keys |  |  |
| APPLICATION_CRON_SCHEDULE | string | */1 * * * * | How often should poll for applications data |  |  |
| APPLICATION_CRON_ENABLED | boolean | true | Should poll for applications data |  |  |
| CLIENTS_CRON_SCHEDULE | string | */5 * * * * | How often should check for outdated clients |  |  |
| CLIENTS_CRON_ENABLED | string | true | Should check for outdated clients |  |  |
| CHANNEL_DID_CRON_SCHEDULE | string | */1 * * * * | How often should exchange channel roles for DIDs |  |  |
| CHANNEL_DID_CRON_ENABLED | boolean | true | Should poll for channel DIDs |  |  |
| MESSAGE_CLEANER_CRON_ENABLED | boolean | true | Should clean messages data |  |  |
| MESSAGE_CLEANER_CRON_SCHEDULE | string | */30 * * * * | How often should clean messages data |  |  |
| CLIENT_EXPIRATION_DAYS | number | 30 | Time to live of a client |  |  |
| SYMMETRIC_KEYS_CRON_SCHEDULE | string | */1 * * * * | How often should poll for symmetric keys |  |  |
| SYMMETRIC_KEYS_CRON_ENABLED | boolean | true | Should poll for symmetric keys |  |  |
| TOPICS_CRON_SCHEDULE | string | */1 * * * * | How often should poll for topics data |  |  |
| TOPICS_CRON_ENABLED | boolean | true | Should poll for topics data |  |  |
| FILE_CLEANER_CRON_SCHEDULE | string | */1 * * * * | How often should check and delete expired downloaded files |  |  |
| FILE_CLEANER_CRON_ENABLED | boolean | true | Should check for downloaded/expired files |  |  |
| ROLES_REFRESH_CRON_SCHEDULE | string | */1 * * * * | How often should check for DID roles changes |  |  |
| ROLES_REFRESH_CRON_ENABLED | boolean | true | Should check for DID roles changes |  |  |
| PRIVATE_KEY_CRON_SCHEDULE | string | */11 * * * * | How often should check for private key changes in secrets engine |  |  |
| PRIVATE_KEY_CRON_ENABLED | boolean | true | Should check for private key changes |  |  |
| HEARTBEAT_CRON_SCHEDULE | string | 30 * * * * * | How often CRON JOB heartbeat should run |  |  |
| HEARTBEAT_CRON_ENABLED | boolean | true | Should run heartbeat |  |  |
| UPLOAD_FILES_LIFETIME | number | 30 | Specifies how long stored files should live (in minutes) |  |  |
| DOWNLOAD_FILES_LIFETIME | number | 30 | Specifies how long downloaded file should live (in minutes) |  |  |
| DID_LISTENER_ENABLED | boolean | true | Should listen for DID attributes changes |  |  |
| ASSOCIATION_KEY_INTERVAL | number | 24 | Association key interval (hours) |  |  |
| ASSOCIATION_KEY_OFFSET | number | 144 | Association key validity time (hours) |  |  |
| REQ_LOCK_TIMEOUT | number | 5 | Maximum request lock lifetime (in seconds) |  |  |
| VERSION_FILE_PATH | string | ./version.md | Version file path |  |  |
| IPFS_HOST | string | ipfs.infura.io | IPFS Host |  |  |
| IPFS_PORT | number | 5001 | IPFS Port |  |  |
| IPFS_PROTOCOL | string | https:// | IPFS Protocol |  |  |
| INFURA_PROJECT_ID | string | 2GHrFIa6STLEM25RKf9GIcdD1kt | Infura Project ID |  |  |
| INFURA_PROJECT_SECRET | string | d978891a32df1ff04a800e54fbfbb6b6 | Infura Project API Key |  |  |
| NODE_ENV | string |  | Node environment |  |  |
| DSB_BASE_URL | string | https://dsb-demo.energyweb.org | Message broker URL |  |  |
| UPLOAD_FILES_DIR | string | ./upload | Directory where we should store temporary files for upload |  |  |
| DOWNLOAD_FILES_DIR | string | ./download | Directory where we should store downloaded files for limited time |  |  |
| LOG_LEVEL | string | info | Minimal log level ("fatal" \| "error" | "warn" | "info" | "debug" | "trace" | "silent") | fatal,error,warn,info,debug,trace |  |
| LOG_PRETTY | boolean | false | Should colorize logs, only use in dev mode |  |  |
| MTLS_ENABLED | boolean | true | Should enable mTLS |  |  |
| DB_SYNC | boolean | false | Should generate migrations (dev use only) |  |  |
| DB_NAME | string | postgresql://ddhub:ddhub@localhost:5432/ddhub | Database connection string |  |  |
| DB_DRIVER | string | postgres | Database driver | postgres,better-sqlite3 |  |
| CLIENT_ID | string | WS_CONSUMER | WS client id |  |  |
| MAX_RETRIES | number | 3 | Specifies maximum amount of retries for vulnerable methods |  |  |
| RETRY_FACTOR | number | 2 | Specifies retry factor (multiplier for timeout) for vulnerable methods |  |  |
| TIMEOUT | number | 1000 | Specifies mininum timeout (how much app should wait before retries) for vulnerable methods |  |  |
| MAX_TIMEOUT | number | 60000 | Specifies maximum timeout (how much app should wait before retries) for vulnerable methods |  |  |
| MESSAGING_MAX_TIMEOUT | number | 60000 | Specifies messaging maximum timeout (how much app should wait before retries) for vulnerable methods |  |  |
| INTERNAL_EVENTS_TIMEOUT | number | 5 | How often internal events interval should execute (seconds) |  |  |
| USE_CACHE | boolean | true | Should use cache |  |  |
| SECRETS_ENGINE | string |  | Secrets engine to use | aws,vault,azure |  |
| VAULT_ENDPOINT | string |  | Vault path |  | SECRETS_ENGINE == vault |
| VAULT_TOKEN | string | root | Vault auth token |  | SECRETS_ENGINE == vault |
| SECRET_PREFIX | string | ddhub/ |  |  |  |
| AWS_REGION | string | ap-southeast-2 | AWS Secrets Manager region |  | SECRETS_ENGINE == aws |
| AZURE_VAULT_URL | string |  | Azure Vault URL |  | SECRETS_ENGINE == azure |
| OPENTELEMETRY_ENABLED | boolean | false |  |  |  |
| OTEL_IGNORED_ROUTES | string | health,api/v2/health | OTEL ignored routes |  | OPENTELEMETRY_ENABLED == true |
| OTEL_TRACING_URL | string | http://localhost:4318/v1/traces | OTEL collector tracing URL |  | OPENTELEMETRY_ENABLED == true |
| OTEL_SERVICE_NAME | string | ddhub-client-gateway | OTEL service name tag |  | OPENTELEMETRY_ENABLED == true |
| OTEL_ENVIRONMENT | string | local | OTEL environment name tag |  | OPENTELEMETRY_ENABLED == true |
| RPC_URL | string | https://volta-rpc.energyweb.org/ | EWF RPC URL |  |  |
| PARENT_NAMESPACE | string | ddhub.apps.energyweb.iam.ewc | Parent namespace for IAM lookup |  |  |
| EVENT_SERVER_URL | string | identityevents-dev.energyweb.org | NATS URL for listening for DID roles updates |  |  |
| NATS_ENV_NAME | string | ewf-dev |  |  |  |
| CHAIN_ID | number | 73799 | Chain ID |  |  |
| CACHE_SERVER_URL | string | https://identitycache-dev.energyweb.org/v1 | SSI HUB url |  |  |
| CLAIM_MANAGER_ADDRESS | string | 0x5339adE9332A604A1c957B9bC1C6eee0Bcf7a031 | Overrides default IAM Client Lib claim manager address |  |  |
| CHAIN_NAME | string | VOLTA | Chain name |  |  |
| ENS_URL | string | https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org | Will be deprecated - same as RPC_URL |  |  |
