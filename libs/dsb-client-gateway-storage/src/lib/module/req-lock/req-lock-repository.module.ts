import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReqLockEntity } from './entity';
import { ReqLockRepository } from './repository';
import { ReqLockWrapperRepository } from './wrapper';

@Module({
  imports: [TypeOrmModule.forFeature([ReqLockEntity, ReqLockRepository])],
  providers: [ReqLockWrapperRepository],
  exports: [ReqLockWrapperRepository],
})
export class ReqLockRepositoryModule {}
