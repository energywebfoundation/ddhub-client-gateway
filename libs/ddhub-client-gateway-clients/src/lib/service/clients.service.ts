import { Injectable, Logger } from '@nestjs/common';
import {
  ClientEntity,
  ClientWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  ConfigDto,
  DdhubConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { Span } from 'nestjs-otel';
import { MaximumNumberOfClientsReachedException } from '../exceptions/maximum-number-of-clients-reached.exception';
import { LessThan } from 'typeorm';

@Injectable()
export class ClientsService {
  protected readonly logger = new Logger(ClientsService.name);

  constructor(
    protected readonly wrapper: ClientWrapperRepository,
    protected readonly ddhubConfigService: DdhubConfigService
  ) {}

  @Span('clients_upsert')
  public async upsert(clientId: string): Promise<void> {
    const exists: ClientEntity | undefined =
      await this.wrapper.repository.findOne({
        where: {
          clientId,
        },
      });

    if (!exists) {
      await this.attemptCreateClient(clientId);

      return;
    }

    await this.wrapper.repository.update(
      {
        clientId,
        id: exists.id,
      },
      {
        clientId,
      }
    );
  }

  @Span('clients_getOutdated')
  public async getOutdatedClients(till: Date): Promise<ClientEntity[]> {
    return this.wrapper.repository.find({
      where: {
        updatedDate: LessThan(till),
      },
    });
  }

  @Span('clients_delete')
  public async delete(clientId: string): Promise<void> {
    await this.wrapper.repository.delete({
      clientId,
    });
  }

  @Span('clients_getAll')
  public async getAll(): Promise<ClientEntity[]> {
    return this.wrapper.repository.find();
  }

  @Span('clients_attempt')
  public async attemptCreateClient(clientId: string): Promise<void> {
    this.logger.log(`attempting to create new client ${clientId}`);

    const currentCount: number = await this.wrapper.repository.count();

    const config: ConfigDto = await this.ddhubConfigService.getConfig();

    if (currentCount + 1 >= config.natsMaxClientidSize) {
      this.logger.log(`failed to create client ${clientId}`);

      throw new MaximumNumberOfClientsReachedException(
        config.natsMaxClientidSize
      );
    }

    await this.wrapper.repository.save({
      clientId,
    });

    this.logger.log(`created new client ${clientId}`);
  }
}
