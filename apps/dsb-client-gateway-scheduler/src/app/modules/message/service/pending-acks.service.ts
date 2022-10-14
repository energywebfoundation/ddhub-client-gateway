import { Injectable, Logger } from '@nestjs/common';
import {
  ConfigDto,
  DdhubConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  PendingAcksEntity,
  PendingAcksWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ReadStream } from 'fs';
import Highland from 'highland';
import moment from 'moment';

@Injectable()
export class PendingAcksService {
  private readonly logger = new Logger(PendingAcksService.name);

  constructor(
    protected readonly ddhubConfigService: DdhubConfigService,
    protected readonly wrapper: PendingAcksWrapperRepository
  ) {}

  public async deleteOutdated(): Promise<void> {
    const config: ConfigDto = await this.ddhubConfigService.getConfig();

    const pendingAcksStream: ReadStream =
      await this.wrapper.pendingAcksRepository.createQueryBuilder().stream();

    await Highland(pendingAcksStream)
      .errors((error) => {
        this.logger.error(error);
      })
      .map<Promise<PendingAcksEntity>>(async (rawEntity: any) => {
        const pendingAcksEntity = new PendingAcksEntity();

        pendingAcksEntity.clientId = rawEntity.PendingAcksEntity_clientId;
        pendingAcksEntity.mbTimestamp = rawEntity.PendingAcksEntity_mbTimestamp;
        pendingAcksEntity.messageId = rawEntity.PendingAcksEntity_messageId;
        pendingAcksEntity.createdDate = rawEntity.PendingAcksEntity_createdDate;

        return pendingAcksEntity;
      })
      .flatMap<PendingAcksEntity>(Highland)
      .filter((entity: PendingAcksEntity) =>
        moment(entity.mbTimestamp)
          .add(config.msgExpired, 'seconds')
          .utc()
          .isSameOrBefore(moment())
      )
      .map<Promise<PendingAcksEntity>>(async (entity: PendingAcksEntity) => {
        await this.wrapper.pendingAcksRepository.delete({
          messageId: entity.messageId,
          clientId: entity.clientId,
        });

        this.logger.log(
          `removed pending ack ${entity.clientId}:${entity.messageId}`
        );

        return entity;
      })
      .flatMap(Highland);
  }
}
