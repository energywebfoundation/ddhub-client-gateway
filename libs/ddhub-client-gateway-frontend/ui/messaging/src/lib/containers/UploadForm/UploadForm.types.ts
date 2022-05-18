type TFileExtensions = '.csv' | '.tsv' | '.xml' | '.json';
export type TFileType = 'csv' | 'tsv' | 'xml' | 'json';

export type TAcceptedFileTypes = Record<
  TFileType,
  Record<string, [TFileExtensions]>
>;
