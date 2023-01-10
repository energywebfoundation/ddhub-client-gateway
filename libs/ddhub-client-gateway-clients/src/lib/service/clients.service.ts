import { Injectable, Logger } from '@nestjs/common';
import {
  ClientEntity,
  ClientWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  ConfigDto,
  DdhubClientsService,
  DdhubConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { Span } from 'nestjs-otel';
import { MaximumNumberOfClientsReachedException } from '../exceptions/maximum-number-of-clients-reached.exception';
import { In, LessThan } from 'typeorm';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Injectable()
export class ClientsService {
  protected readonly logger = new Logger(ClientsService.name);

  constructor(
    protected readonly wrapper: ClientWrapperRepository,
    protected readonly ddhubConfigService: DdhubConfigService,
    protected readonly ddhubClientsService: DdhubClientsService,
    protected readonly iamService: IamService
  ) {}

  @Span('clients_sync')
  public async syncMissingClientsIds(): Promise<void> {
    const did: string | null = this.iamService.getDIDAddress();

    if (!did) {
      this.logger.error(
        `failing to sync clients due to not initialized iam service`
      );

      return;
    }

    const clients: string[] = await this.ddhubClientsService.getClients();
    const existingClients: ClientEntity[] = await this.wrapper.repository.find(
      {}
    );

    for (const clientId of clients) {
      const clientWithRemovedDid: string = clientId.replace(did, '');

      const matchingClient: ClientEntity | undefined = existingClients.find(
        (clientEntity: ClientEntity) =>
          clientEntity.clientId === clientWithRemovedDid
      );

      if (matchingClient) {
        this.logger.debug(`client already exists ${clientId}`);

        continue;
      }

      this.logger.log(`storing client ${clientWithRemovedDid}`);

      await this.wrapper.repository.save({
        clientId: clientWithRemovedDid,
      });
    }
  }

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

    await this.ddhubClientsService.deleteClients([clientId]);
  }

  @Span('clients_getAll')
  public async getAll(): Promise<ClientEntity[]> {
    return this.wrapper.repository.find();
  }

  @Span('clients_canUse')
  public async canUse(clientId: string): Promise<boolean> {
    const exists: boolean = await this.wrapper.repository
      .count({
        where: {
          clientId,
        },
      })
      .then((count: number) => count > 0);

    if (exists) {
      return true;
    }

    const currentCount: number = await this.wrapper.repository.count();

    const config: ConfigDto = await this.ddhubConfigService.getConfig();

    return currentCount + 1 < config.natsMaxClientidSize;
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

    await this.wrapper.repository
      .save({
        clientId,
      })
      .then(() => {
        this.logger.log(`created new client ${clientId}`);
      })
      .catch((e) => {
        if (e?.code === '23505') {
          this.logger.warn(
            `Duplicate clientid ${clientId} detected. No need save to db.`
          );
        } else {
          throw e;
        }
      });
    this.logger.log(`created new client ${clientId}`);
  }

  @Span('clients_deleteMany')
  public async deleteMany(clientsIds: string[]): Promise<void> {
    await this.wrapper.repository.delete({
      clientId: In(clientsIds),
    });

    await this.ddhubClientsService.deleteClients(clientsIds);
  }
}
