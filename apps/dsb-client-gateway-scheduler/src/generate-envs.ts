import { getSchema } from './app/utils/config.validate';
import { generateEnvs } from '@dsb-client-gateway/ddhub-client-gateway-env';

(async () => {
  generateEnvs(
    getSchema(),
    'Scheduler env. variables',
    './docs/scheduler-variables.md'
  );
})();
