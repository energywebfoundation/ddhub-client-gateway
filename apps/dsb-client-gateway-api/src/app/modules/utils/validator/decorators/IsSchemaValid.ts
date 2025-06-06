import Ajv from 'ajv';
import { SchemaNotValidException } from '../../../message/exceptions/schema-not-valid.exception';
import { SchemaType } from '../../../message/message.const';
import addFormats from 'ajv-formats';
import { MalformedJSONException } from '../../../message/exceptions/malformed-json.exception';
import { DateTime } from 'luxon';

export function IsSchemaValid(
  schemaType: string,
  schema: object,
  payload: string
) {
  let isValid = true;
  switch (schemaType) {
    case SchemaType.JSD7:
      isValid = validateJSONSchema(schema, payload);
      break;
  }
  return isValid;
}

function validateJSONSchema(schema: object, payload: string) {
  const ajv = new Ajv({ allErrors: true, multipleOfPrecision: 1 });
  ajv.addVocabulary(['uiSchema', 'enumNames']);

  addFormats(ajv, {
    mode: 'fast',
    formats: [
      'date',
      // 'time', -> temporarily disable
      'date-time',
      'duration',
      'uri',
      'uri-reference',
      'uri-template',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uuid',
      'json-pointer',
      'byte',
      'float',
      'double',
    ],
    keywords: true,
  });
  ajv.addFormat('local-date-time', {
    type: 'string',
    validate: (value: string): boolean => {
      return DateTime.fromISO(value).isValid;
    },
  });

  let validate;
  let jsonPayload: object;
  try {
    jsonPayload = JSON.parse(payload);
  } catch (e) {
    throw new MalformedJSONException();
  }

  try {
    validate = ajv.compile(schema);
  } catch (e) {
    throw new SchemaNotValidException(e.message);
  }
  const valid: boolean = validate(jsonPayload);

  if (valid) {
    return true;
  } else if (validate) {
    throw new SchemaNotValidException(validate.errors[0]);
  }
}
