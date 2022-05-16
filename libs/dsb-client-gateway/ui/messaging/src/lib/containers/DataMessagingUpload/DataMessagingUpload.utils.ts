export const bytesToMegaBytes = (bytes: number) =>
  (bytes / (1024 * 1024)).toFixed(2);

export enum FileType {
  CSV = 'csv',
  TSV = 'tsv',
  XML = 'xml',
  JSD7 = 'json',
  XSD6 = 'json',
}

export const MIN_FILE_SIZE = 5242880;
export const MAX_FILE_SIZE = 52428800;
