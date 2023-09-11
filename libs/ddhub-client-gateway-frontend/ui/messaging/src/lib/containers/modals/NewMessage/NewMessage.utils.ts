import {
  FormSelectOption,
  GenericFormField,
} from '@ddhub-client-gateway-frontend/ui/core';

export const fields: { [name: string]: GenericFormField } = {
  channel: {
    name: 'Channel',
    label: 'Channel',
    options: [] as FormSelectOption[],
    formInputsWrapperProps: {
      margin: '23px 15px 0 0',
    },
    inputProps: {
      placeholder: 'Select channel',
    },
  },
  topic: {
    name: 'Topic Name',
    label: 'Topic Name',
    options: [] as FormSelectOption[],
    formInputsWrapperProps: {
      margin: '23px 15px 0 0',
      flexGrow: 1,
    },
    inputProps: {
      placeholder: 'Select topic',
    },
  },
  version: {
    name: 'Version',
    label: 'Topic Version',
    options: [] as FormSelectOption[],
    formInputsWrapperProps: {
      margin: '23px 15px 0 0',
      width: '40%',
    },
    inputProps: {
      placeholder: 'Select version',
    },
  },
};
