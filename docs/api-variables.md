# API env. variables

| KEY | TYPE | DEFAULT | DESCRIPTION | ALLOWED_VALUES | DEPENDENCY |
| --- | ---- | ------- | ----------- | -------------- | ---------- |
| PORT | number | 3333 | HTTP port |  |  |
| WEBSOCKET | string | NONE | Websocket mode | NONE,SERVER,CLIENT |  |
| EVENTS_MAX_PER_SECOND | number | 2 | Amount of messages to pull for each WebSocket run |  |  |
| EVENTS_EMIT_MODE | string | BULK | Should Websocket emit messages as array or single object | SINGLE,BULK |  |
| DID_TTL | number | 60 | How long cached DID attributes should be valid |  |  |
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
