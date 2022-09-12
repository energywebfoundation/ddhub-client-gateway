import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../../dsb-client-gateway-api/src/app/app.module';
import { Logger } from 'nestjs-pino';

export const setupApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      AppModule.register({
        shouldValidate: true,
        envFilePath: '.env.test',
      }),
    ],
  }).compile();

  moduleRef.useLogger(moduleRef.get(Logger));

  const app = moduleRef.createNestApplication();

  await app.init();

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const transformedErrors = errors
          .map((error) => Object.values(error.constraints))
          .flat();

        return new ValidationException(transformedErrors);
      },
    })
  );

  return app;
};
