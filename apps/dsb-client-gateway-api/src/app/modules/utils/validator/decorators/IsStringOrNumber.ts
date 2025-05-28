import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || typeof value === 'number';
        },
        defaultMessage(): string {
          return 'Value must be a string or number';
        },
      },
    });
  };
}
