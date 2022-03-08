export abstract class SecretsEngineService {
  abstract setPrivateKey(privateKey: string): Promise<void>;
  abstract setCertificateDetails(details: CertificateDetails): Promise<void>;
  abstract setEncryptionKeys(keys: EncryptionKeys): Promise<void>;
  abstract getPrivateKey(): Promise<string | null>;
  abstract getCertificateDetails(): Promise<CertificateDetails>;
  abstract getEncryptionKeys(): Promise<EncryptionKeys>;
}

export interface CertificateDetails {
  privateKey: string;
  certificate: string;
  caCertificate?: string;
}

export interface EncryptionKeys {
  createdAt,
  privateDerivedKey,
  publicMasterKey,
  privateMasterKey
}
