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
          const regularExpression: string = configService.get(
            'EWT_ROOT_NAMESPACE_VALIDATION_REGULAR_EXPRESSION'
          );

          if (value.includes('"')) {
            return false;
          } else if (typeof value === 'string' && value.length > 0) {
            return !!value.match(new RegExp(regularExpression));
          }
          return false;
        },
      },
    });
  };
}
