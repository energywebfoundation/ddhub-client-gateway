import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidChannelName(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidChannelName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'string' && value.length > 0) {
            return !!value.match(/^[a-z0-9.]{1,255}$/);
          }
          return false;
        },
      },
    });
  };
}
