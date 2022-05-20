export enum WebSocketImplementation {
  NONE = 'NONE',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
}

export enum SchemaType {
  JSD7 = 'JSD7',
  XSD6 = 'XSD6',
  XML = 'XML',
  CSV = 'CSV',
  TSV = 'TSV',
}

export enum EncryptedMessageType {
  'UTF-8' = 'utf-8',
  BINARY = 'binary',
}

export enum EncryptionStatus {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  NOT_REQUIRED = 'NOT_REQUIRED',
  NOT_PERFORMED = 'NOT_PERFORMED',
}
