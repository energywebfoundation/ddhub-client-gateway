import * as fs from 'fs';
import * as Yaml from 'json-to-pretty-yaml';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

export const generateSchema = async () => {
  const document = await createDocument();

  if (!document.components.schemas) {
    document.components.schemas = {};
  }

  fs.writeFileSync(
    '../../libs/dsb-client-gateway-api-client/schema.yaml',
    Yaml.stringify(document)
  );
};

(async () => {
  await generateSchema();
  process.exit();
})();
