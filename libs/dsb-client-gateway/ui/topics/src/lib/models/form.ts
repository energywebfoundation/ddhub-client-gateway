import { FormSelectOption } from '@dsb-client-gateway/ui/core';

export const schemaTypeOptions: FormSelectOption[] = [
  { value: 'JSD7', label: 'JSD7' },
  { value: 'XML', label: 'XML' },
  { value: 'CSV', label: 'CSV' },
  { value: 'TSV', label: 'TSV' },
];

export const fields = {
  topicName: {
    name: 'name',
    label: 'Topic name',
    formInputsWrapperProps: {
      width: 254,
      marginRight: '15px',
    },
    inputProps: {
      placeholder: 'Topic name',
    },
  },
  version: {
    name: 'version',
    label: 'Version',
    formInputsWrapperProps: {
      width: 145,
    },
    inputProps: {
      placeholder: 'Version',
    },
  },
  tags: {
    name: 'tags',
    label: 'Tags',
    options: [] as FormSelectOption[],
    autocomplete: true,
    maxValues: 20,
    multiple: true,
    tags: true,
    inputProps: {
      placeholder: 'Tags',
    },
  },
  schemaType: {
    name: 'schemaType',
    label: 'Schema type',
    options: schemaTypeOptions,
    inputProps: {
      placeholder: 'Schema type',
    },
  },
  schema: {
    name: 'schema',
    label: 'Schema Definition',
    inputProps: {
      placeholder: 'Schema Definition',
    },
  },
};
