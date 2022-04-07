import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  AbstractLokiRepository,
  LokiService,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ChannelEntity } from '../entity/channel.entity';
import { ChannelType } from '../channel.const';

@Injectable()
export class ChannelRepository
  extends AbstractLokiRepository
  implements OnModuleInit
{
  private readonly logger = new Logger(ChannelRepository.name);

  constructor(protected readonly lokiService: LokiService) {
    super('channel', lokiService);
  }

  public onModuleInit(): void {
    this.createCollectionIfNotExists(this.collection, ['fqcn']);
  }

  public async createChannel(entity: ChannelEntity): Promise<void> {
    this.logger.log(`Creating channel ${entity.fqcn}`);

    this.client.getCollection<ChannelEntity>(this.collection).insert(entity);

    await this.lokiService.save();
  }

  public getChannel(name: string): ChannelEntity | null {
    this.logger.debug(`Retrieving channel ${name}`);

    return this.client
      .getCollection<ChannelEntity>(this.collection)
      .findObject({
        fqcn: name,
      });
  }

  public getChannelsByType(type?: ChannelType): ChannelEntity[] {
    if (!type) {
      return this.client.getCollection<ChannelEntity>(this.collection).find({});
    }

    return this.client.getCollection<ChannelEntity>(this.collection).find({
      type,
    });
  }

  public async updateChannel(entity: ChannelEntity): Promise<void> {
    this.logger.log(`Updating channel ${entity.fqcn}`);

    this.client.getCollection<ChannelEntity>(this.collection).updateWhere(
      ({ fqcn }) => fqcn === entity.fqcn,
      (obj) => obj
    );

    await this.lokiService.save();
  }

  public async delete(channelName: string): Promise<void> {
    this.client.getCollection<ChannelEntity>(this.collection).removeWhere({
      fqcn: channelName,
    });

    await this.lokiService.save();
  }

  public getAll(): ChannelEntity[] {
    return this.client.getCollection<ChannelEntity>(this.collection).find({});
  }
}
