import { routerConst } from "@ddhub-client-gateway-frontend/ui/utils";

/**
 * Swagger UI is served by the API, not by the Admin UI. Prefix the docs path
 * with the API base URL so the link also works when the UI and the API run on
 * different origins (e.g. local development). When the variable is empty the
 * UI and API share an origin behind a reverse proxy and a relative link works.
 */
const apiBaseUrl = (process.env.NEXT_PUBLIC_SERVER_BASE_URL ?? '').replace(
  /\/+$/,
  ''
);

export const useIntegrationContainerEffects = () => {
  const restApiUrl = `${apiBaseUrl}${routerConst.RestApiDocs}`;
  const websocketApiUrl = routerConst.WS;
  return { restApiUrl, websocketApiUrl };
};
