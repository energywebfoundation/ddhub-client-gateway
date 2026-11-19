import * as fs from 'fs';
import * as Yaml from 'json-to-pretty-yaml';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createSwaggerDocument } from './swagger/swagger.config';

export const createDocument = async () => {
  const app = await NestFactory.create(
    AppModule.register({ shouldValidate: false }),
    { bodyParser: false }
  );
  app.setGlobalPrefix('api/v2');

  return createSwaggerDocument(app);
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
