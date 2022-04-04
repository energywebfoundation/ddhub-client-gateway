import * as fs from 'fs';
import * as Yaml from 'json-to-pretty-yaml';
import { createDocument } from '@dsb-client-gateway/dsb-client-gateway-api';

export const generateSchema = async () => {
  const document = await createDocument();

  if (!document.components.schemas) {
    document.components.schemas = {};
  }

  fs.writeFileSync('./schema.yaml', Yaml.stringify(document));
};

(async () => {
  await generateSchema();
  process.exit();
})();
