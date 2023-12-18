import {
  FormSelectOption,
  GenericFormField,
} from '@ddhub-client-gateway-frontend/ui/core';
import { PROPERTIES_KEY } from '@rjsf/utils';

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

export const constructDefaultData = (schema: string) => {
  try {
    const jsonSchema = JSON.parse(schema);
    const properties = jsonSchema.properties;
    if (!properties || Object.keys(properties).length === 0) return [];

    let data: Record<string, any> = {};
    for (const key in properties) {
      if (properties[key].default) {
        data[key] = properties[key].default;
      }
    }

    return Object.keys(data).length > 0 ? data : [];
  } catch (e) {
    console.error('constructDefaultData', e);
    return [];
  }
};
