import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { AppModule } from '../../../../../dsb-client-gateway-api/src/app/app.module';

const e2eEnvPath = path.join(__dirname, '../../../../.env.test');

export const setupApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      AppModule.register({
        shouldValidate: true,
        envFilePath: e2eEnvPath,
      }),
    ],
  }).compile();

  const app = moduleRef.createNestApplication({ bodyParser: false });
  const configService = moduleRef.get(ConfigService);

  app.use(
    bodyParser.json({ limit: configService.get<string>('REQUEST_BODY_SIZE') })
  );
  app.use(
    bodyParser.urlencoded({
      limit: configService.get<string>('REQUEST_BODY_SIZE'),
      extended: true,
    })
  );

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

export const teardownApp = async (app?: INestApplication): Promise<void> => {
  if (app) {
    await app.close();
  }
};
