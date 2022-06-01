export abstract class SecretsEngineService {
  abstract setPrivateKey(privateKey: string): Promise<void>;
  abstract setCertificateDetails(details: CertificateDetails): Promise<void>;
  abstract setEncryptionKeys(keys: EncryptionKeys): Promise<void>;
  abstract setRSAPrivateKey(privateKey: string): Promise<void>;
  abstract getPrivateKey(): Promise<string | null>;
  abstract getCertificateDetails(): Promise<CertificateDetails>;
  abstract getEncryptionKeys(): Promise<EncryptionKeys>;
  abstract getRSAPrivateKey(): Promise<string | null>;
  abstract deleteAll(): Promise<void>;
}

export interface CertificateDetails {
  privateKey: string;
  certificate: string;
  caCertificate?: string;
}

export interface EncryptionKeys {
  createdAt;
  privateDerivedKey;
  publicMasterKey;
  privateMasterKey;
}
