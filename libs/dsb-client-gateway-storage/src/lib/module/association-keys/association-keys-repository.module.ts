import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociationKeyEntity } from './entity/association-key.entity';
import { AssociationKeysRepository } from './repository/association-keys.repository';
import { AssociationKeysWrapperRepository } from './wrapper/association-keys-wrapper.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssociationKeyEntity]),
  ],
  providers: [AssociationKeysRepository, AssociationKeysWrapperRepository],
  exports: [AssociationKeysWrapperRepository],
})
export class AssociationKeysRepositoryModule {}
