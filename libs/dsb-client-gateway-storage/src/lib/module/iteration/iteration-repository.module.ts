import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IterationEntity } from './entity/iteration.entity';
import { IterationWrapperRepository } from './wrapper';
import { IterationRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([IterationEntity, IterationRepository])],
  providers: [IterationWrapperRepository],
  exports: [IterationWrapperRepository],
})
export class IterationRepositoryModule {}
