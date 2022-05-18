import { TAcceptedFileTypes } from './UploadForm.types';

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
};
