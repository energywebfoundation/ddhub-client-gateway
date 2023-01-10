export const SECRETS_ENGINE_SERVICE_KEY = class SecretsEngineServiceKeyToken {};

export enum SecretsEngine {
  AWS = 'aws',
  VAULT = 'vault',
  AZURE = 'azure',
}

export enum SecretType {
  RSA = 'rsa',
  PRIVATE_KEY = 'private_key',
  CERTIFICATE = 'certificate',
  MNEMONIC = 'mnemonic',
}
