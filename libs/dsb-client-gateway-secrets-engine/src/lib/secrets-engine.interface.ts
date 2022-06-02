import {
  CreateSecretResponse,
  PutSecretValueResponse,
} from '@aws-sdk/client-secrets-manager';

export abstract class SecretsEngineService {
  abstract setPrivateKey(privateKey: string): Promise<SetPrivateKeyResponse>;
  abstract getPrivateKey(): Promise<string | null>;
  abstract setCertificateDetails(
    details: CertificateDetails
  ): Promise<SetCertificateDetailsResponse>;
  abstract getCertificateDetails(): Promise<CertificateDetails>;
  abstract setEncryptionKeys(
    keys: EncryptionKeys
  ): Promise<SetEncryptionKeysResponse>;
  abstract getEncryptionKeys(): Promise<EncryptionKeys | null>;
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
  | CreateSecretResponse
  | PutSecretValueResponse
  | null;
