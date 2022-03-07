/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const globalPrefix = 'api/v1';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('DSB Client Gateway')
    .setDescription('DSB Client Gateway')
    .setVersion('1.0')
    .build();

  app.useWebSocketAdapter(new WsAdapter(app));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT');

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
