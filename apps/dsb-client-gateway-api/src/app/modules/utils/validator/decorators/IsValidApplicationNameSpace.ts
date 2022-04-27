import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidApplicationNameSpace(
  validationOptions?: ValidationOptions
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVersion',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (value.includes('"')) {
            return false;
          } else if (typeof value === 'string' && value.length > 0) {
            return !!value.match(/\w.apps.*\w.iam.ewc/);
          }
          return false;
        },
      },
    });
  };
}
