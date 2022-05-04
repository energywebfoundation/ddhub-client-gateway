import Ajv from 'ajv';
const ajv = new Ajv({ multipleOfPrecision: 1 });
import { SchemaNotValidException } from '../../../message/exceptions/schema-not-valid.exception';
import { SchemaType } from '../../../message/message.const';
import addFormats from 'ajv-formats';

export function IsSchemaValid(
  schemaType: string,
  schema: object,
  payload: string
) {
  addFormats(ajv, {
    mode: 'fast',
    formats: [
      'date',
      'time',
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
      'int32',
      'int64',
      'float',
      'double',
      'password',
      'binary',
    ],
    keywords: true,
  });

  let isValid = true;
  switch (schemaType) {
    case SchemaType.JSD7:
      isValid = validateJSONSchema(schema, payload);
      break;
  }
  return isValid;
}

function validateJSONSchema(schema: object, payload: string) {
  let validate: any;
  let jsonPayload: object;
  try {
    jsonPayload = JSON.parse(payload);
  } catch (e) {
    throw new SchemaNotValidException(
      'Payload cannot be parsed to JSON object'
    );
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
    throw new SchemaNotValidException(
      JSON.stringify(ajv.errorsText(validate.errors))
    );
  }
}
