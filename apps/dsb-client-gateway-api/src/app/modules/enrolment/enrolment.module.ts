import { Module } from '@nestjs/common';
import { EnrolmentService } from './service/enrolment.service';
import { NatsListenerService } from './service/nats-listener.service';
import { EnrolmentController } from './enrolment.controller';
import { UtilsModule } from '../utils/utils.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [UtilsModule, StorageModule],
  providers: [EnrolmentService, NatsListenerService],
  controllers: [EnrolmentController]
})
export class EnrolmentModule {

}
