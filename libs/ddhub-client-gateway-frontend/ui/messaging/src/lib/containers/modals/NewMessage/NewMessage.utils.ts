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
    emptyPlaceholder: 'No channels available',
  },
  topic: {
    name: 'Topic Name',
    label: 'Topic Name',
    options: [] as FormSelectOption[],
    required: true,
    inputProps: {
      placeholder: 'Select topic',
    },
    emptyPlaceholder: 'No topics available',
  },
  version: {
    name: 'Version',
    label: 'Topic Version',
    options: [] as FormSelectOption[],
    required: true,
    inputProps: {
      placeholder: 'Select version',
    },
    emptyPlaceholder: 'No versions available',
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

export const constructDefaultData = (schema: string): Record<string, any> => {
  try {
    const jsonSchema = JSON.parse(schema);
    const properties = jsonSchema.properties;
    console.log('constructDefaultData', properties, jsonSchema);
    if (!properties || Object.keys(properties).length === 0) return {};

    const data: Record<string, any> = {};
    for (const key in properties) {
      if (properties[key].default !== undefined) {
        data[key] = properties[key].default;
      }
    }
    console.log('constructDefaultData', data);

    return Object.keys(data).length > 0 ? data : {};
  } catch (e) {
    console.error('constructDefaultData', e);
    return {};
  }
};
