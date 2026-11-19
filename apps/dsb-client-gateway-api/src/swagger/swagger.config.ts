import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { ResponseErrorDto } from '../app/modules/utils/dto/response-error.dto';
import { GetChannelMessagesCountDto } from '../app/modules/channel/dto/request/get-channel-messages-count.dto';
import { enrichSwaggerDocument } from './swagger-access.enricher';
import {
  SECURITY_API_KEY,
  SECURITY_BEARER,
  SWAGGER_PATH,
  SWAGGER_TAG_DESCRIPTIONS,
} from './swagger.constants';

const API_DESCRIPTION = `
REST API of the **EWDS Client Gateway (EWDS CGW)**, the participant-hosted gateway that connects an organisation to the Energy Web Digital Spine (EWDS) so it can exchange credential-governed data with every authorised counterparty.

All routes are served under \`/api/v2\`. The OpenAPI document is available at \`/docs-json\` (or \`/docs-yaml\`) and can be imported into Postman.

<details>
<summary><strong>Getting started</strong></summary>

1. **Identity**: set the gateway private key with \`POST /identity\`. The gateway derives its DID and publishes its signing and RSA public keys to the DID document.
2. **Enrolment**: request the roles needed under \`PARENT_NAMESPACE\` with \`POST /enrol\`, then wait until an issuer approves them. Track progress with \`GET /enrol\`; the gateway is ready once every required role is \`SYNCED\`.
3. **mTLS** (when \`MTLS_ENABLED=true\`): upload the client certificate for the message broker with \`POST /certificate\`.
4. **Topics**: find the payload schemas you want to use with \`GET /applications\` and \`GET /topics\`, or create your own with \`POST /topics\` (the message broker checks that the gateway DID may manage topics of the owning application).
5. **Channels**: create a channel per data flow with \`POST /channels\`. The channel type decides the direction and the endpoints used:

| Channel type | Direction | Endpoints |
|---|---|---|
| \`pub\` | Send messages | \`POST /messages\` |
| \`sub\` | Receive messages | \`GET /messages\`, \`POST /messages/ack\`, WebSocket \`/events\` |
| \`upload\` | Send files | \`POST /messages/upload\` |
| \`download\` | Receive files | \`GET /messages/download\` |

6. **Exchange data**: send and receive messages and files through the channel. Every message is signed by the gateway; payloads are additionally encrypted end-to-end when the channel has \`payloadEncryption\` enabled.

</details>

<details>
<summary><strong>Authentication and roles</strong></summary>

Authentication is controlled by the \`USER_AUTH_ENABLED\` environment variable.

* \`USER_AUTH_ENABLED=false\` (default): no credentials are required on any endpoint.
* \`USER_AUTH_ENABLED=true\`: every endpoint marked with a lock requires **one** of:
  * \`Authorization: Bearer <accessToken>\`: an access token obtained from \`POST /login\` (valid for 1 hour, renew it with \`POST /login/refresh-token\`).
  * \`x-api-key: <apiKey>\`: an API key created with \`POST /user-api-key/api-keys\`. Recommended for system-to-system integrations.

Each user and API key carries exactly one role:

| Role | Access |
|---|---|
| \`superadmin\` | Every endpoint. |
| \`admin\` | Every endpoint. |
| \`messaging\` | Only the endpoints that list \`messaging\` in their **Access** section: mainly sending and receiving messages, and reading channels, topics, applications and clients. Configuration endpoints are rejected. API keys stored without a role are treated as \`messaging\`. |

Requests whose user or API key has any other role are rejected.

Each operation below has an **Access** section (and an \`x-access\` extension) that is generated from the guards actually applied in code, so it always reflects runtime behaviour. Credential and role failures return **HTTP 403** with error code \`DHCG::UNAUTHORIZED\`.

</details>

<details>
<summary><strong>Errors</strong></summary>

Every error response has the same shape (\`ResponseErrorDto\`):

\`\`\`json
{
  "err": {
    "code": "VALIDATION::FAILED",
    "reason": "Validation failed",
    "additionalDetails": { "errors": ["fqcn must be a string"] }
  },
  "statusCode": 400,
  "timestamp": "2026-01-01T00:00:00.000Z"
}
\`\`\`

\`err.code\` is a stable, namespaced identifier (see the \`ResponseError.code\` schema for the full list). Use it, not \`err.reason\`, for programmatic handling.

| Prefix | Origin |
|---|---|
| \`DHCG::\` | Gateway generic errors (unknown error, unauthorized, route not found) |
| \`VALIDATION::\` | Request body, query or path parameter validation |
| \`ID::\`, \`IAM::\` | Gateway identity and the Energy Web SSI-Hub client |
| \`BIP39::\` | Association key mnemonic |
| \`CHANNEL::\`, \`TOPIC::\` | Channel and topic configuration |
| \`MESSAGING::\` | Sending, receiving and file transfer |
| \`DDHUB::\`, \`MB::\` | Errors returned by the EWDS Message Broker |
| \`SIG::\` | Message signature verification |
| \`SECRETS_ENGINE::\` | Secret storage configuration (operator side) |
| \`CONTACT::\` | Address book |

</details>

<details>
<summary><strong>WebSocket</strong></summary>

When \`WEBSOCKET=SERVER\`, subscribers can receive messages pushed in real time at \`ws(s)://<host>/events?clientId=<clientId>\` with sub-protocol \`ddhub-protocol\`, instead of polling \`GET /messages\`. \`EVENTS_EMIT_MODE\` (\`SINGLE\` or \`BULK\`) and \`EVENTS_MAX_PER_SECOND\` control how messages are emitted. The WebSocket is not described by this OpenAPI document.

</details>
`.trim();

export const buildSwaggerConfig = (): Omit<OpenAPIObject, 'paths'> => {
  const builder = new DocumentBuilder()
    .setTitle('EWDS Client Gateway API')
    .setDescription(API_DESCRIPTION)
    .setVersion('2.0')
    .setExternalDoc(
      'OpenAPI document (JSON, importable into Postman)',
      `/${SWAGGER_PATH}-json`
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Access token returned by `POST /api/v2/login` (field `accessToken`). Valid for 1 hour. Only checked when `USER_AUTH_ENABLED=true`.',
      },
      SECURITY_BEARER
    )
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description:
          'API key created with `POST /api/v2/user-api-key/api-keys`. The key role (`admin`, `superadmin` or `messaging`) decides which endpoints it can call. Only checked when `USER_AUTH_ENABLED=true`.',
      },
      SECURITY_API_KEY
    );

  Object.entries(SWAGGER_TAG_DESCRIPTIONS).forEach(([name, description]) =>
    builder.addTag(name, description)
  );

  return builder.build();
};

/**
 * Builds the OpenAPI document from the controller and DTO decorators, then
 * enriches every operation with access rules and standard error responses
 * derived from the guards applied in code.
 */
export const createSwaggerDocument = (app: INestApplication): OpenAPIObject => {
  const document = SwaggerModule.createDocument(app, buildSwaggerConfig(), {
    extraModels: [ResponseErrorDto, GetChannelMessagesCountDto],
  });

  if (!document.components.schemas) {
    document.components.schemas = {};
  }

  return enrichSwaggerDocument(app, document);
};

/**
 * Workaround for @nestjs/swagger: it embeds the document into
 * `swagger-ui-init.js` with `String.prototype.replace` and a string
 * replacement, so sequences such as "$`", "$'" or "$&" inside descriptions
 * (for example a regex ending in `$` written in a markdown code span) are
 * expanded as replacement patterns and produce invalid JavaScript.
 *
 * For the UI init script only, every `$` is doubled; `replace` turns `$$`
 * back into `$`, so the UI shows the document unchanged. The JSON and YAML
 * endpoints (and the generated client schema) keep the original document.
 */
const SWAGGER_UI_INIT_SCRIPT = /swagger-ui-init\.js(\?.*)?$/;

const escapeForSwaggerUiInit = (document: OpenAPIObject): OpenAPIObject =>
  JSON.parse(JSON.stringify(document).replace(/\$/g, '$$$$'));

const uiSafeDocumentPatcher = () => {
  let escaped: OpenAPIObject | undefined;

  return (
    req: { url?: string; originalUrl?: string },
    _res: unknown,
    document: OpenAPIObject
  ): OpenAPIObject => {
    if (!SWAGGER_UI_INIT_SCRIPT.test(req.originalUrl ?? req.url ?? '')) {
      return document;
    }

    escaped ??= escapeForSwaggerUiInit(document);

    return escaped;
  };
};

/**
 * Swagger UI styles inline `code` with 5px vertical padding and a large bold
 * font, so code spans in multi-line descriptions overlap the lines above and
 * below. Keep inline code within the line box and give text more line height.
 */
const SWAGGER_UI_CSS = `
.swagger-ui .markdown p, .swagger-ui .renderedMarkdown p,
.swagger-ui .markdown li, .swagger-ui .renderedMarkdown li {
  line-height: 1.6;
}
.swagger-ui .markdown code, .swagger-ui .renderedMarkdown code {
  padding: 1px 4px;
  font-size: 0.9em;
  line-height: inherit;
  border-radius: 3px;
  overflow-wrap: anywhere;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.swagger-ui .info details {
  margin: 8px 0;
  padding: 8px 14px;
  border: 1px solid rgba(59, 65, 81, 0.2);
  border-radius: 4px;
}
.swagger-ui .info details[open] summary {
  margin-bottom: 8px;
}
.swagger-ui .info summary {
  cursor: pointer;
  font-size: 15px;
}
.swagger-ui .markdown pre code, .swagger-ui .renderedMarkdown pre code {
  padding: 0;
  font-weight: 400;
  background: none;
}
`;

/**
 * Swagger UI plugins. These functions are serialised with `toString()` into
 * `swagger-ui-init.js` and run in the browser, so they must be
 * self-contained (no imports, no closures) and must not contain a dollar sign
 * (see the String.replace issue above).
 *
 * The built-in "Filter by tag" box only does a case-sensitive substring match
 * on tag names, so `channels` or `/messages` find nothing. This filter is
 * case-insensitive and also matches the path, HTTP method, summary and
 * operationId of each operation. When a tag name matches, the whole tag is
 * kept; otherwise only the matching operations are shown.
 */
function caseInsensitiveOperationFilterPlugin() {
  return {
    fn: {
      opsFilter: function (taggedOps, phrase) {
        const query = String(phrase || '')
          .trim()
          .toLowerCase();

        if (!query) {
          return taggedOps;
        }

        return taggedOps
          .map(function (tagObj, tagName) {
            if (String(tagName).toLowerCase().indexOf(query) !== -1) {
              return tagObj;
            }

            return tagObj.set(
              'operations',
              tagObj.get('operations').filter(function (op) {
                const operation = op.get('operation');
                const text = [
                  op.get('path'),
                  op.get('method'),
                  operation && operation.get('summary'),
                  operation && operation.get('operationId'),
                ]
                  .join(' ')
                  .toLowerCase();

                return text.indexOf(query) !== -1;
              })
            );
          })
          .filter(function (tagObj) {
            return tagObj.get('operations').size > 0;
          });
      },
    },
  };
}

/** Swagger UI's default plugin list is replaced by `plugins`, so keep DownloadUrl. */
function downloadUrlPlugin(system) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SwaggerUIBundle.plugins.DownloadUrl(system);
}

const SWAGGER_UI_PLUGINS = [downloadUrlPlugin, caseInsensitiveOperationFilterPlugin];

export const setupSwagger = (app: INestApplication): OpenAPIObject => {
  const document = createSwaggerDocument(app);

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    customSiteTitle: 'EWDS Client Gateway API',
    customCss: SWAGGER_UI_CSS,
    patchDocumentOnRequest: uiSafeDocumentPatcher(),
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tagsSorter: 'alpha',
      plugins: SWAGGER_UI_PLUGINS,
    },
  });

  return document;
};
