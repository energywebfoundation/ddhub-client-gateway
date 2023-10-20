import {
  CreateSecretResponse,
  PutSecretValueResponse,
} from '@aws-sdk/client-secrets-manager';
import { OnModuleInit } from '@nestjs/common';
import { KeyVaultSecret } from '@azure/keyvault-secrets';

export enum PATHS {
  IDENTITY_PRIVATE_KEY = 'identity/private_key',
  CERTIFICATE = 'certificate/certificate',
  CERTIFICATE_KEY = 'certificate/private_key',
  CA_CERTIFICATE = 'certificate/ca_certificate',
  RSA_KEY = 'rsa_key',
  MNEMONIC = 'mnemonic',
  USERS = 'users',
}

export abstract class SecretsEngineService implements OnModuleInit {
  abstract onModuleInit(): Promise<void>;
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
  abstract setMnemonic(mnemonic: string): Promise<string>;
  abstract getMnemonic(): Promise<string | null>;
  abstract deleteAll(): Promise<void>;

  /**
   *
   * @param username
   * @param password
   *
   * @returns {String|null} user password
   */
  abstract getUserAuthDetails(username: string): Promise<string | null>;

  abstract setUserPassword(username: string, password: string): Promise<void>;
  abstract getAllUsers(): Promise<UsersList>;
}

export type UsersList = Array<{ username: string; password: string }>;

export interface CertificateDetails {
  privateKey: string;
  certificate: string;
  caCertificate?: string;
}

export type SetPrivateKeyResponse =
  | PutSecretValueResponse
  | CreateSecretResponse
  | KeyVaultSecret
  | null;
export type SetRSAPrivateKeyResponse =
  | PutSecretValueResponse
  | CreateSecretResponse
  | KeyVaultSecret
  | null;
export type SetCertificateDetailsResponse =
  | CreateSecretResponse[]
  | PutSecretValueResponse[]
  | KeyVaultSecret[]
  | null;
