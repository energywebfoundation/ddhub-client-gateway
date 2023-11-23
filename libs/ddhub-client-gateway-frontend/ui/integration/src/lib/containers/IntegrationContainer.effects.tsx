import { routerConst } from "@ddhub-client-gateway-frontend/ui/utils";

export const useIntegrationContainerEffects = () => {
  const restApiUrl = routerConst.RestApiDocs;
  const websocketApiUrl = routerConst.WS;
  return { restApiUrl, websocketApiUrl };
};
