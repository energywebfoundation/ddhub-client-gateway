import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookEntity } from './entity';
import { AddressBookRepository } from './repository';
import { AddressBookRepositoryWrapper } from './wrapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressBookEntity]),
  ],
  providers: [AddressBookRepository, AddressBookRepositoryWrapper],
  exports: [AddressBookRepositoryWrapper],
})
export class AddressBookRepositoryModule {}
