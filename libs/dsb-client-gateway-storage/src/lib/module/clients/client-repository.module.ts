import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entity/client.entity';
import { ClientRepository } from './repository/client.repository';
import { ClientWrapperRepository } from './wrapper/client-wrapper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, ClientRepository])],
  providers: [ClientWrapperRepository],
  exports: [ClientWrapperRepository],
})
export class ClientRepositoryModule {}
