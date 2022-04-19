import { keyBy } from 'lodash';
import { FormSelectOption } from '@dsb-client-gateway/ui/core';

export const schemaTypeOptions: FormSelectOption[] = [
  { value: 'json', label: 'JSD7' },
  { value: 'xml', label: 'XML' },
  { value: 'csv', label: 'CSV' },
  { value: 'tsv', label: 'TSV' },
];

export const schemaTypeOptionsByValue = keyBy(schemaTypeOptions, 'value');
export const schemaTypeOptionsByLabel = keyBy(schemaTypeOptions, 'label');
