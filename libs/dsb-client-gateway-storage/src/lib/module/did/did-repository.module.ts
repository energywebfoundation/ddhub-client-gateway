import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DidEntity } from './entity/did.entity';
import { DidRepository } from './repository/did.repository';
import { DidWrapperRepository } from './wrapper';

@Module({
  imports: [TypeOrmModule.forFeature([DidEntity, DidRepository])],
  providers: [DidWrapperRepository],
  exports: [DidWrapperRepository],
})
export class DidRepositoryModule {}
