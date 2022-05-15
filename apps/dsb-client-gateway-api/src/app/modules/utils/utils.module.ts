import { Global, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { DigestGuard } from './guards/digest.guard';
import { RetryConfigService } from './service/retry-config.service';

@Global()
@Module({
  providers: [AuthService, DigestGuard, RetryConfigService],
  exports: [AuthService, RetryConfigService],
})
export class UtilsModule {}
