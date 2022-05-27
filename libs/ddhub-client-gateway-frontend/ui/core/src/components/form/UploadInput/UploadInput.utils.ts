import { TAcceptedFileTypes } from './UploadInput.types';

export const acceptedFileTypes: TAcceptedFileTypes = {
  csv: {
    'text/csv': ['.csv'],
  },
  tsv: {
    'text/tsv': ['.tsv'],
  },
  xml: {
    'application/xml': ['.xml'],
  },
  json: {
    'application/json': ['.json'],
  },
  pem: {
    'text/pem': ['.pem'],
  },
  key: {
    'text/key': ['.key'],
  },
  crt: {
    'text/crt': ['.crt'],
  },
};

export enum FileTypesEnum {
  CSV = 'csv',
  TSV = 'tsv',
  XML = 'xml',
  JSON = 'json',
  PEM = 'pem',
  KEY = 'key',
  CRT = 'crt',
}
