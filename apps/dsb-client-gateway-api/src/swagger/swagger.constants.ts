/**
 * Shared constants for the OpenAPI document.
 *
 * Tag names are part of the generated frontend client contract
 * (`libs/dsb-client-gateway-api-client`, orval `mode: 'tags'` derives file
 * names from them), so never rename a tag without regenerating the client.
 */

export const SWAGGER_PATH = 'docs';
export const API_GLOBAL_PREFIX = 'api/v2';

export const SECURITY_BEARER = 'bearer';
export const SECURITY_API_KEY = 'api-key';

export const SwaggerTags = {
  HEALTH: 'Health',
  GATEWAY: 'Gateway',
  LOGIN: 'Login',
  USER_API_KEY: 'User-ApiKey',
  IDENTITY: 'Identity',
  ENROLMENT: 'Enrolment',
  SSI_HUB: 'SSI Hub',
  GATEWAY_CONFIGURATION: 'Gateway Configuration',
  KEYS: 'Keys configuration',
  APPLICATIONS: 'Applications',
  TOPICS: 'Topics',
  CHANNELS: 'Channels',
  MESSAGING: 'Messaging',
  ADDRESS_BOOK: 'Address Book',
  CLIENTS: 'Clients',
  CRON: 'Cron',
} as const;

export const SWAGGER_TAG_DESCRIPTIONS: Record<string, string> = {
  [SwaggerTags.HEALTH]:
    'Liveness and readiness of the gateway and of the services it depends on. Public; intended for container orchestrators and load balancers.',
  [SwaggerTags.GATEWAY]:
    'Current gateway status: version, DID, message broker connection, certificate and login mode. Public.',
  [SwaggerTags.LOGIN]:
    'Exchange a username and password for a JWT access/refresh token pair, refresh tokens, and discover whether user authentication is enabled. Only meaningful when `USER_AUTH_ENABLED=true`.',
  [SwaggerTags.USER_API_KEY]:
    'Manage user accounts and API keys. Every user and API key carries one role (`admin`, `superadmin` or `messaging`) that decides which endpoints it can call.',
  [SwaggerTags.IDENTITY]:
    'The gateway DID: set its private key, read its public keys, balance and enrolment status, and list its claims (role credentials).',
  [SwaggerTags.ENROLMENT]:
    'Role enrolment of the gateway DID. The gateway needs the `user.roles.<PARENT_NAMESPACE>` role to be approved and synced to its DID document before it can log in to the EWDS Message Broker.',
  [SwaggerTags.SSI_HUB]:
    'Proxy to the Energy Web SSI-Hub: list applications and their roles, read the roles held by the gateway DID, and request or remove role claims.',
  [SwaggerTags.GATEWAY_CONFIGURATION]:
    'Gateway-level configuration such as the mTLS client certificate used to reach the EWDS Message Broker.',
  [SwaggerTags.KEYS]:
    'Association keys: short-lived keys that other participants can use to send messages to this gateway instead of its DID.',
  [SwaggerTags.APPLICATIONS]:
    'Applications registered in the Energy Web SSI-Hub that the gateway DID is related to. Applications own topics.',
  [SwaggerTags.TOPICS]:
    'Topics are versioned payload schemas owned by an application namespace. Every message is sent on one topic version and validated against its schema.',
  [SwaggerTags.CHANNELS]:
    'Channels are local gateway configurations, identified by an FQCN, that bind topics to a direction (publish/subscribe, messaging/file transfer) and to the DIDs or roles allowed to send to or receive from them.',
  [SwaggerTags.MESSAGING]:
    'Send, receive, acknowledge and download messages and files through a channel. Payloads are signed and encrypted end-to-end by the gateway.',
  [SwaggerTags.ADDRESS_BOOK]:
    'Local address book that maps counterpart DIDs to human-readable aliases. Only used for display.',
  [SwaggerTags.CLIENTS]:
    'Message broker consumer clients (durable subscriptions) created by this gateway. Each `clientId` keeps its own read position on every subscribed channel.',
  [SwaggerTags.CRON]:
    'Status of the background jobs (cron) run by the API and the scheduler.',
};
