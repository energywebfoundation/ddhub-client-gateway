export interface GatewayConfig {
  namespace: string;
  messageBrokerStatus: string;
  mtlsIsValid?: boolean;
  did: string;
}
