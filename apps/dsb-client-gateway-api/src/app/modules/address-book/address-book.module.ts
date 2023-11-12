import { Module } from '@nestjs/common';
import { DdhubClientGatewayAddressBookModule } from '@dsb-client-gateway/ddhub-client-gateway-address-book';
import { AddressBookController } from './address-book.controller';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    DdhubClientGatewayAddressBookModule,
    DdhubClientGatewayUserRolesModule,
  ],
  controllers: [AddressBookController],
})
export class AddressBookModule {}
