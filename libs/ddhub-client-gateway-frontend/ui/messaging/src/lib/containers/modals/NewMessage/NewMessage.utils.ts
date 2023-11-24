import {
  FormSelectOption,
  GenericFormField,
} from '@ddhub-client-gateway-frontend/ui/core';

export const fields: { [name: string]: GenericFormField } = {
  channel: {
    name: 'Channel',
    label: 'Channel',
    options: [] as FormSelectOption[],
    required: true,
    inputProps: {
      placeholder: 'Select channel',
    },
  },
  topic: {
    name: 'Topic Name',
    label: 'Topic Name',
    options: [] as FormSelectOption[],
    required: true,
    inputProps: {
      placeholder: 'Select topic',
    },
  },
  version: {
    name: 'Version',
    label: 'Topic Version',
    options: [] as FormSelectOption[],
    required: true,
    inputProps: {
      placeholder: 'Select version',
    },
  },
  transactionId: {
    name: 'Transaction ID',
    label: 'Transaction ID',
    required: false,
    inputProps: {
      defaultValue: '',
      placeholder: 'Enter a transaction ID',
    },
  },
};
