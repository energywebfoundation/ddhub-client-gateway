import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import otelSDK from './app/modules/utils/tracing';

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create(
    AppModule.register({ shouldValidate: true })
  );

  app.enableCors();

  const globalPrefix = 'api/v2';

  app.setGlobalPrefix(globalPrefix);

  const configService = app.get<ConfigService>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('DSB Client Gateway')
    .setDescription('DSB Client Gateway')
    .setVersion('2.0')
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();

  app.useWebSocketAdapter(new WsAdapter(app));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT');

  app.enableShutdownHooks();

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

export const createDocument = async () => {
  const app = await NestFactory.create(
    AppModule.register({ shouldValidate: false })
  );
  app.setGlobalPrefix('api/v2');

  const config = new DocumentBuilder()
    .setTitle('DSB Client Gateway')
    .setDescription('DSB Client Gateway')
    .setVersion('2.0')
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();

  return SwaggerModule.createDocument(app, config);
};

bootstrap();
