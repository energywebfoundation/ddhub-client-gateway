import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';

export function IsValidApplicationNameSpace(
  configService: ConfigService,
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
          const applicationNameSpacePattern: string = configService.get(
            'APPLICATION_NAMESPACE_REGULAR_EXPRESSION'
          );
          if (value.includes('"')) {
            return false;
          } else if (typeof value === 'string' && value.length > 0) {
            return !!value.match(new RegExp(applicationNameSpacePattern));
          }
          return false;
        },
      },
    });
  };
}
