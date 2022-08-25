import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as bodyParser from 'body-parser';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { otelSDK } from '@dsb-client-gateway/ddhub-client-gateway-tracing';
import { ValidationException } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { Logger } from 'nestjs-pino';

dotenv.config({
  path: '.env',
});

async function bootstrap() {
  if (process.env.OPENTELEMETRY_ENABLED === 'true') {
    console.log('starting open telemetry');
    await otelSDK.start();
  } else {
    console.log('open telemetry disabled');
  }

  const app = await NestFactory.create(
    AppModule.register({ shouldValidate: true }),
    {
      bufferLogs: true,
    }
  );

  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const globalPrefix = 'api/v2';

  app.setGlobalPrefix(globalPrefix);

  const configService = app.get<ConfigService>(ConfigService);

  app.use(
    bodyParser.json({ limit: configService.get<string>('REQUEST_BODY_SIZE') })
  );
  app.use(
    bodyParser.urlencoded({
      limit: configService.get<string>('REQUEST_BODY_SIZE'),
      extended: true,
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const transformedErrors = errors
          .map((error) => Object.values(error.constraints))
          .flat();

        return new ValidationException(transformedErrors);
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle('DDHub Client Gateway')
    .setDescription('DDHub Client Gateway')
    .setVersion('2.0')
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();

  app.useWebSocketAdapter(new WsAdapter(app));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT');

  app.enableShutdownHooks();

  await app.listen(port);

  console.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
