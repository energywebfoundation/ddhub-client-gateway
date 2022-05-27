type TFileExtensions =
  | '.csv'
  | '.tsv'
  | '.xml'
  | '.json'
  | '.pem'
  | '.key'
  | '.crt';
export type TFileType = 'csv' | 'tsv' | 'xml' | 'json' | 'pem' | 'key' | 'crt';

export type TAcceptedFileTypes = Record<
  TFileType,
  Record<string, [TFileExtensions]>
>;
