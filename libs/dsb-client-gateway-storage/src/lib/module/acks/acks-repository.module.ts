import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcksEntity } from './entity';
import { AcksRepository } from './repository';
import { AcksWrapperRepository } from './wrapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcksEntity, AcksRepository]),
  ],
  providers: [AcksWrapperRepository],
  exports: [AcksWrapperRepository],
})
export class AcksRepositoryModule { }

