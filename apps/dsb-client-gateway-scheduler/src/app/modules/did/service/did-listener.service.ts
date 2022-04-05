import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DidRegistryListenerService } from '@dsb-client-gateway/dsb-client-gateway-did-registry';

@Injectable()
export class DidListenerService implements OnModuleInit {
  private readonly logger = new Logger(DidListenerService.name);

  constructor(
    protected readonly didRegistryListenerService: DidRegistryListenerService
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.didRegistryListenerService.startListening();

    this.logger.log('Listening for DID Attribute changees');
  }
}
