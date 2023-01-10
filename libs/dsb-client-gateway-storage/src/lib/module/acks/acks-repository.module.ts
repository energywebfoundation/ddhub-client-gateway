import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcksEntity, PendingAcksEntity } from './entity';
import { AcksRepository, PendingAcksRepository } from './repository';
import { AcksWrapperRepository, PendingAcksWrapperRepository } from './wrapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcksEntity, AcksRepository, PendingAcksEntity, PendingAcksRepository]),
  ],
  providers: [AcksWrapperRepository, PendingAcksWrapperRepository],
  exports: [AcksWrapperRepository, PendingAcksWrapperRepository],
})
export class AcksRepositoryModule { }

