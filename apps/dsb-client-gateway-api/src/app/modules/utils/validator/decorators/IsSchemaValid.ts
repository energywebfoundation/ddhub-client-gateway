const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })
import { SchemaNotValidException } from '../../../message/exceptions/schema-not-valid.exception';

export function IsSchemaValid(schema, json) {
    const validate = ajv.compile(schema)
    const valid = validate(json)
    if (valid) { return true }
    else {
        throw new SchemaNotValidException(JSON.stringify(ajv.errorsText(validate.errors)))
    }
}