import { FormSelectOption } from '@ddhub-client-gateway-frontend/ui/core';

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
      marginRight: '15px',
      flexGrow: 1,
    },
    inputProps: {
      placeholder: 'Topic name',
    },
  },
  version: {
    name: 'version',
    label: 'Version',
    formInputsWrapperProps: {
      width: '40%',
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
      maxLength: 50,
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
