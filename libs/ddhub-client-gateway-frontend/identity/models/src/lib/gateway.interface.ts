export interface GatewayConfig {
  authEnabled: boolean;
  namespace: string;
  messageBrokerStatus: string;
  mtlsIsValid?: boolean;
  did: string;
}
