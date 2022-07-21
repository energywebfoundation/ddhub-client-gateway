import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [GatewayController],
  exports: [],
})
export class GatewayModule {}
