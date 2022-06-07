import {
  CreateSecretResponse,
  PutSecretValueResponse,
} from '@aws-sdk/client-secrets-manager';

export const enum PATHS {
  IDENTITY_PRIVATE_KEY = 'identity/private_key',
  CERTIFICATE = 'certificate/certificate',
  CERTIFICATE_KEY = 'certificate/private_key',
  CA_CERTIFICATE = 'certificate/ca_certificate',
  RSA_KEY = 'rsa_key',
}

export abstract class SecretsEngineService {
  abstract setPrivateKey(privateKey: string): Promise<SetPrivateKeyResponse>;
  abstract getPrivateKey(): Promise<string | null>;
  abstract setCertificateDetails(
    details: CertificateDetails
  ): Promise<SetCertificateDetailsResponse>;
  abstract getCertificateDetails(): Promise<CertificateDetails>;
  abstract setRSAPrivateKey(
    privateKey: string
  ): Promise<SetRSAPrivateKeyResponse>;
  abstract getRSAPrivateKey(): Promise<string | null>;
}

export interface CertificateDetails {
  privateKey: string;
  certificate: string;
  caCertificate?: string;
}

export interface EncryptionKeys {
  createdAt: string;
  privateDerivedKey: string;
  publicMasterKey: string;
  privateMasterKey: string;
}

export type SetPrivateKeyResponse =
  | PutSecretValueResponse
  | CreateSecretResponse
  | null;
export type SetRSAPrivateKeyResponse =
  | PutSecretValueResponse
  | CreateSecretResponse
  | null;
export type SetCertificateDetailsResponse =
  | CreateSecretResponse[]
  | PutSecretValueResponse[]
  | null;
export type SetEncryptionKeysResponse =
  | CreateSecretResponse[]
  | PutSecretValueResponse[]
  | null;
