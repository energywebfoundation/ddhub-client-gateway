import { Injectable, Logger } from '@nestjs/common';
import { EthereumDIDRegistry__factory } from '@dsb-client-gateway/dsb-client-gateway-did-registry';
import { ConfigService } from '@nestjs/config';
import { Provider } from './provider';
import { CommandBus } from '@nestjs/cqrs';
import { DidAttributeChangedCommand } from '../command/did-attribute-changed.command';

@Injectable()
export class DidRegistryListenerService {
  private didRegistry;
  private readonly logger = new Logger(DidRegistryListenerService.name);
  private readonly eventName = 'DIDAttributeChanged';

  constructor(
    private readonly configService: ConfigService,
    private readonly provider: Provider,
    private readonly commandBus: CommandBus
  ) {}

  public async startListening(): Promise<void> {
    const didregistryaddress = this.configService.get<string>(
      'DID_REGISTRY_ADDRESS'
    );

    const chainName = this.configService.get<string>('CHAIN_NAME');

    this.didRegistry = EthereumDIDRegistry__factory.connect(
      didregistryaddress,
      this.provider
    );

    this.didRegistry.on(this.eventName, async (address) => {
      const did = `did:ethr:${chainName}:${address}`;

      this.logger.log(`Received attribute change on ${did}`);

      await this.commandBus.execute(new DidAttributeChangedCommand(did));
    });
  }
}
