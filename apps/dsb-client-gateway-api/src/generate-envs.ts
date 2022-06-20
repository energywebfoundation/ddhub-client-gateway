import { generateEnvs } from '@dsb-client-gateway/ddhub-client-gateway-env';
import { getSchema } from './app/modules/utils/config.validate';

(async () => {
  generateEnvs(getSchema(), 'API env. variables', './docs/api-variables.md');
})();
