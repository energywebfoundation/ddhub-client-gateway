export abstract class SecretsEngineService {
  abstract setPrivateKey(privateKey: string): Promise<void>;
  abstract getPrivateKey(): Promise<string | null>;
  abstract setCertificateDetails(details: CertificateDetails): Promise<void>;
  abstract getCertificateDetails(): Promise<CertificateDetails>;
  abstract setEncryptionKeys(keys: EncryptionKeys): Promise<void>;
  abstract getEncryptionKeys(): Promise<EncryptionKeys>;
  abstract setRSAPrivateKey(privateKey: string): Promise<void>;
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
