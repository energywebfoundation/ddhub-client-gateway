import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidVersion(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isVersion',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          if (typeof value === 'string' && value.length > 0) {
            return !!value.match(/^(\d+\.)(\d+\.)(\d+)$/);
          }
          return false;
        },
      },
    });
  };
}
