import { Global, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { RetryConfigService } from './service/retry-config.service';

@Global()
@Module({
  providers: [AuthService, RetryConfigService],
  exports: [AuthService, RetryConfigService],
})
export class UtilsModule {}
