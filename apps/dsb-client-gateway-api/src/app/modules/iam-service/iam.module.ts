import { Global, Module } from '@nestjs/common';
import { IamFactoryService } from './service/iam-factory.service';
import { IamService } from './service/iam.service';

@Global()
@Module({
  providers: [IamFactoryService, IamService],
  exports: [IamService],
})
export class IamModule {}
