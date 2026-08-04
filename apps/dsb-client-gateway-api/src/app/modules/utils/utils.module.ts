import { Global, Module } from '@nestjs/common';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { AuthService } from './service/auth.service';
import { RetryConfigService } from './service/retry-config.service';

@Global()
@Module({
  imports: [SecretsEngineModule],
  providers: [AuthService, RetryConfigService],
  exports: [AuthService, RetryConfigService],
})
export class UtilsModule {}
