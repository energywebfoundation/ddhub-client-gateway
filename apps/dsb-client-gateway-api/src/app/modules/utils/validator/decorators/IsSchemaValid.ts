import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });
import { SchemaNotValidException } from '../../../message/exceptions/schema-not-valid.exception';
import { SchemaType } from '../../../message/message.const';

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
    throw new SchemaNotValidException(
      'Payload cannot be parsed to JSON object.'
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
