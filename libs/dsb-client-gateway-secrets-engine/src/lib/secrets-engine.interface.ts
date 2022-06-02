import {
  CreateSecretResponse,
  PutSecretValueResponse,
} from '@aws-sdk/client-secrets-manager';

export abstract class SecretsEngineService {
  abstract setPrivateKey(privateKey: string): Promise<SetPrivateKeyResponse>;
  abstract getPrivateKey(): Promise<string | void>;
  abstract setCertificateDetails(
    details: CertificateDetails
  ): Promise<SetCertificateDetailsResponse>;
  abstract getCertificateDetails(): Promise<CertificateDetails>;
  abstract setEncryptionKeys(
    keys: EncryptionKeys
  ): Promise<SetEncryptionKeysResponse>;
  abstract getEncryptionKeys(): Promise<EncryptionKeys>;
  abstract setRSAPrivateKey(
    privateKey: string
  ): Promise<SetRSAPrivateKeyResponse>;
  abstract getRSAPrivateKey(): Promise<string | void>;
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
  | void;
export type SetRSAPrivateKeyResponse =
  | PutSecretValueResponse
  | CreateSecretResponse
  | void;
export type SetCertificateDetailsResponse =
  | CreateSecretResponse[]
  | PutSecretValueResponse[]
  | void;
export type SetEncryptionKeysResponse =
  | CreateSecretResponse
  | PutSecretValueResponse
  | void;
