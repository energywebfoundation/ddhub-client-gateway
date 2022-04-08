import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsVersion(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVersion',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const didPattern =
            '^([0-9]+).([0-9]+).([0-9]+)(?:-([0-9A-Za-z-]+(?:.[0-9A-Za-z-]+)*))?(?:+[0-9A-Za-z-]+)?$';
          const matchA = value.match(didPattern);
          return matchA?.groups;
        },
      },
    });
  };
}
