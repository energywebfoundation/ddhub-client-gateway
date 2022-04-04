export interface CertificateFiles {
  cert: string;
  key?: string;
  ca?: string;
}

export interface Keys {
  privateMasterKey: string;
  publicMasterKey: string;
  createdAt: string;
  privateDerivedKey: string | null;
}
