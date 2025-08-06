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
  API_KEY = 'api_key',
  API_KEY_NAME = 'api_key_name',
}

export abstract class SecretsEngineService implements OnModuleInit {
  abstract onModuleInit(): Promise<void>;
  abstract setPrivateKey(privateKey: string): Promise<SetPrivateKeyResponse>;
  abstract getPrivateKey(): Promise<string | null>;
  abstract setCertificateDetails(
    details: CertificateDetails
  ): Promise<SetCertificateDetailsResponse>;
  abstract getCertificateDetails(): Promise<CertificateDetails | null>;
  abstract setRSAPrivateKey(
    privateKey: string
  ): Promise<SetRSAPrivateKeyResponse>;
  abstract getRSAPrivateKey(): Promise<string | null>;
  abstract setMnemonic(mnemonic: string): Promise<string | null>;
  abstract getMnemonic(): Promise<string | null>;
  abstract deleteAll(): Promise<void>;

  /**
   *
   * @param username
   * @param password
   *
   * @returns {String|null} user password
   */
  abstract getUserAuthDetails(username: string): Promise<UserDetails>;
  abstract getAllUsers(): Promise<UsersList>;
  abstract setUserPassword(username: string, password: string, role: UserRole): Promise<void>;
  abstract deleteUser(username: string): Promise<void>;
  abstract createApiKey(name: string, daysValid: number): Promise<ApiKeyDetails>;
  abstract deleteApiKey(apiKey: string): Promise<boolean>;
  abstract getAllApiKeys(): Promise<ApiKeyDetails[]>;
  abstract validateApiKey(apiKey: string): Promise<boolean>;
  abstract getApiKey(apiKey: string): Promise<ApiKeyDetails>;

  isAuthEnabled(): boolean {
    return false; // default
  }

  protected readonly MS_PER_DAY = 24 * 60 * 60 * 1000;
  protected generateRandomKey(length = 48): string {
    return [...Array(length)]
      .map(() => Math.floor(Math.random() * 36).toString(36))
      .join('');
  }
}

export interface UserDetails {
  username: string;
  password: string;
  role: string;
}

export type UsersList = UserDetails[];

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

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
  MESSAGING = 'messaging',
}

export type ApiKeyDetails = {
  apiKey: string;
  name: string;
  expiresAt: string;
};
