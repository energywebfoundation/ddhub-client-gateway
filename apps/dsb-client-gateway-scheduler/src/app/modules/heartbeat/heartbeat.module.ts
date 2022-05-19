import { Module } from '@nestjs/common';
import { HeartbeatService } from './service/heartbeat.service';

@Module({
  providers: [HeartbeatService],
})
export class HeartbeatModule {}
