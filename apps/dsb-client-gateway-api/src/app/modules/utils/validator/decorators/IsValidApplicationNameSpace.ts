import { registerDecorator, ValidationOptions } from 'class-validator';
import { ConfigService } from '@nestjs/config';

export function IsValidApplicationNameSpace(
  configService: ConfigService,
  validationOptions?: ValidationOptions
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isApplicationNameSpace',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const applicationNameSpacePattern: string = configService.get(
            'APPLICATION_NAMESPACE_REGULAR_EXPRESSION'
          );
          if (typeof value === 'string' && value.length > 0) {
            return !!value.match(new RegExp(applicationNameSpacePattern));
          }
          return false;
        },
      },
    });
  };
}
