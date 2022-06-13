import Ajv from 'ajv';
import { SchemaNotValidException } from '../../../message/exceptions/schema-not-valid.exception';
import { SchemaType } from '../../../message/message.const';
import addFormats from 'ajv-formats';
import { MalformedJSONException } from '../../../message/exceptions/malformed-json.exception';

const ajv = new Ajv({ allErrors: true, multipleOfPrecision: 1 });
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
  let validate: any;
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
    throw new SchemaNotValidException(
      JSON.stringify(ajv.errorsText(validate.errors))
    );
  }
}
