import {
  CreateSecretResponse,
  PutSecretValueResponse,
} from '@aws-sdk/client-secrets-manager';
import { KeyVaultSecret } from '@azure/keyvault-secrets';
import { OnModuleInit } from '@nestjs/common';

export enum PATHS {
  IDENTITY_PRIVATE_KEY = 'identity/private_key',
  CERTIFICATE = 'certificate/certificate',
  CERTIFICATE_KEY = 'certificate/private_key',
  CA_CERTIFICATE = 'certificate/ca_certificate',
  RSA_KEY = 'rsa_key',
  MASTER_SEED = 'master_seed',
  ECDH = 'ecdh',
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
  abstract deleteAll(): Promise<void>;
  abstract getMasterSeed(): Promise<string | null>;
  abstract setMasterSeed(seed: string): Promise<void>;
  abstract setKey(tag: string, value: string): Promise<void>;
  abstract getKey(tag: string): Promise<string | null>;
}

export interface Key {
  privateKey: string;
  publicKey: string;
  exp: number;
}

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
