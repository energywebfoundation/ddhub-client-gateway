import { DateTime } from 'luxon';

export enum FileContentType {
  CSV = 'text/csv',
  TSV = 'text/tsv',
  XML = 'application/xml',
  JSD7 = 'application/json',
  XSD6 = 'application/json',
}

export const MESSAGE_BOX_DATE_TIME_FORMAT = 'yyyy/MM/dd h:mm:ss a';

export const formatTimestampFromNanos = (timestampNanos?: number): string => {
  if (!timestampNanos) {
    return '';
  }

  const timestampMillis = Math.round(timestampNanos / 1e6);

  return DateTime.fromMillis(timestampMillis).toFormat(
    MESSAGE_BOX_DATE_TIME_FORMAT
  );
};
