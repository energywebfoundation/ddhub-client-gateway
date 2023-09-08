import { Module } from '@nestjs/common';
import { DdhubClientGatewayAddressBookModule } from '@dsb-client-gateway/ddhub-client-gateway-address-book';
import { AddressBookController } from './address-book.controller';

@Module({
  imports: [DdhubClientGatewayAddressBookModule],
  controllers: [AddressBookController],
})
export class AddressBookModule {}
