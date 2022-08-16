import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyEntity } from './entity/key.entity';
import { KeyWrapperRepository } from './wrapper';
import { KeyRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([KeyEntity, KeyRepository])],
  providers: [KeyWrapperRepository],
  exports: [KeyWrapperRepository],
})
export class KeyRepositoryModule {}
