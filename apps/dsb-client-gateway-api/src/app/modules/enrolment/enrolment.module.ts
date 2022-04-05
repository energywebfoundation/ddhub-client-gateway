import { forwardRef, Module } from '@nestjs/common';
import { EnrolmentService } from './service/enrolment.service';
import { NatsListenerService } from './service/nats-listener.service';
import { EnrolmentController } from './enrolment.controller';
import { UtilsModule } from '../utils/utils.module';
import { StorageModule } from '../storage/storage.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [UtilsModule, StorageModule, forwardRef(() => IdentityModule)],
  providers: [EnrolmentService, NatsListenerService],
  controllers: [EnrolmentController],
  exports: [EnrolmentService],
})
export class EnrolmentModule {}
