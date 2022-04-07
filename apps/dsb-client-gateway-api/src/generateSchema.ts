import * as fs from 'fs';
import * as Yaml from 'json-to-pretty-yaml';
import { createDocument } from './main';

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
