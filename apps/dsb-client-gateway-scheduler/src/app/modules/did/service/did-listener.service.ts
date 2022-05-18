import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DidRegistryListenerService } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DidListenerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DidListenerService.name);

  constructor(
    protected readonly didRegistryListenerService: DidRegistryListenerService,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const isDidListenerEnabled: boolean = this.configService.get<boolean>(
      'DID_LISTENER_ENABLED',
      true
    );

    if (!isDidListenerEnabled) {
      this.logger.warn('DID listener disabled');

      return;
    }

    await this.didRegistryListenerService.startListening();

    this.logger.log('Listening for DID Attribute changees');
  }
}
