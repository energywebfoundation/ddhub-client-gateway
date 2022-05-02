/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { otelSDK } from '@dsb-client-gateway/ddhub-client-gateway-tracing';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  if (process.env.OPENTELEMETRY_ENABLED) {
    await otelSDK.start();
  }

  await NestFactory.createApplicationContext(AppModule);

  Logger.log('Application starting');
}

bootstrap();
