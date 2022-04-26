import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymmetricKeysEntity } from './entity/symmetric-keys.entity';
import { SymmetricKeysRepository } from './repository';
import { SymmetricKeysRepositoryWrapper } from './wrapper/symmetric-keys-repository.wrapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([SymmetricKeysEntity, SymmetricKeysRepository]),
  ],
  providers: [SymmetricKeysRepositoryWrapper],
  exports: [SymmetricKeysRepositoryWrapper],
})
export class SymmetricKeysRepositoryModule {}
