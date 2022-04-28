import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityEntity } from './entity/identity.entity';
import { IdentityRepository } from './repository';
import { IdentityRepositoryWrapper } from './wrapper/identity-repository.wrapper';

@Module({
  imports: [TypeOrmModule.forFeature([IdentityEntity, IdentityRepository])],
  providers: [IdentityRepositoryWrapper],
  exports: [IdentityRepositoryWrapper],
})
export class IdentityRepositoryModule {}
