import { Module } from '@nestjs/common';
import { AddressBookRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { AddressBookService } from './service';

@Module({
  imports: [AddressBookRepositoryModule],
  providers: [AddressBookService],
  exports: [AddressBookService],
})
export class DdhubClientGatewayAddressBookModule {}
