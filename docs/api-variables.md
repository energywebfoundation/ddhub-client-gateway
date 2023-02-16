# API env. variables

| KEY | TYPE | DEFAULT | DESCRIPTION | ALLOWED_VALUES | DEPENDENCY |
| --- | ---- | ------- | ----------- | -------------- | ---------- |
| SWAGGER_SCHEMA_PATH | string | ./libs/dsb-client-gateway-api-client/schema.yaml | Path where OpenAPI Document should be generated - use only in development |  |  |
| GENERATE_SWAGGER | boolean | false | Should generate Swagger document - use only in development |  |  |
| AK_SHARE_CRON_ENABLED | boolean | false | Should share association keys |  |  |
| AK_SHARE_CRON_SCHEDULE | string | */1 * * * * | How often should share association keys |  |  |
| AK_FQCN | string |  | Association keys FQCN |  |  |
| AK_TOPIC_NAME | string |  | Association keys topic name |  |  |
| AK_TOPIC_OWNER | string |  | Association keys topic owner |  |  |
| AK_TOPIC_VERSION | string |  | Association keys topic version |  |  |
| API_KEY | string |  | API Key to protect API |  |  |
| API_USERNAME | string |  | USERNAME for authentication |  |  |
| API_PASSWORD | string |  | PASSWORD for authentication |  |  |
| PORT | number | 3333 | HTTP port |  |  |
| WEBSOCKET | string | NONE | Websocket mode | NONE,SERVER,CLIENT |  |
| EVENTS_MAX_PER_SECOND | number | 2 | Amount of messages to pull for each WebSocket run |  |  |
| EVENTS_EMIT_MODE | string | BULK | Should Websocket emit messages as array or single object | SINGLE,BULK |  |
| DID_TTL | number | 3600 | How long cached DID attributes should be valid in seconds |  |  |
| WEBSOCKET_URL | string |  | WebSocket Client URL to connect |  | WEBSOCKET == CLIENT |
| WEBSOCKET_PROTOCOL | string | dsb-protocol | WebSocket Client protocol |  | WEBSOCKET == CLIENT |
| WEBSOCKET_RECONNECT_TIMEOUT | number | 3000 | WebSocket Client reconnect timeout |  | WEBSOCKET == CLIENT |
| WEBSOCKET_RECONNECT | number | 3000 | Should attempt to reconnect |  | WEBSOCKET == CLIENT |
| WEBSOCKET_RECONNECT_MAX_RETRIES | number | 10 | How many times should attempt to reconnect |  | WEBSOCKET == CLIENT |
| WEBSOCKET_POOLING_TIMEOUT | number | 5000 | How often should poll messages |  | WEBSOCKET == CLIENT |
| DID_CLAIM_NAMESPACE | string | message.broker.app.namespace | Namespace for fetching applications |  |  |
| MAX_FILE_SIZE | number | 100000000 | Maximum file size for large data messaging (100 MB) |  |  |
| SYMMETRIC_KEY_CLIENT_ID | string | test | Client ID for fetching symmetric keys |  |  |
| AMOUNT_OF_SYMMETRIC_KEYS_FETCHED | number |  | Amout of symmetric keys to fetch for each run |  |  |
| MULTER_UPLOADS_PATH | string | uploads | Multer temporary file storage path |  |  |
| APPLICATION_NAMESPACE_REGULAR_EXPRESSION | string | \w.apps.*\w.iam.ewc | Filter for application namespaces |  |  |
| REQUEST_BODY_SIZE | string | 50mb | Maximum request size |  |  |
| USE_CACHE | boolean | true | Should use cache |  |  |
| SECRETS_ENGINE | string |  | Secrets engine to use | aws,vault,azure |  |
| VAULT_ENDPOINT | string |  | Vault path |  | SECRETS_ENGINE == vault |
| VAULT_TOKEN | string | root | Vault auth token |  | SECRETS_ENGINE == vault |
| SECRET_PREFIX | string | ddhub/ |  |  |  |
| AWS_REGION | string | ap-southeast-2 | AWS Secrets Manager region |  | SECRETS_ENGINE == aws |
| AZURE_VAULT_URL | string |  | Azure Vault URL |  | SECRETS_ENGINE == azure |
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
