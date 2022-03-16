import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AbstractLokiRepository } from '../../storage/repository/abstract-loki.repository';
import { ChannelEntity } from '../entity/channel.entity';

@Injectable()
export class ChannelRepository
  extends AbstractLokiRepository
  implements OnModuleInit
{
  private readonly logger = new Logger(ChannelRepository.name);

  constructor() {
    super('channel');
  }

  public onModuleInit(): void {
    this.createCollectionIfNotExists(this.collection);
  }

  public createChannel(entity: ChannelEntity): void {
    this.logger.log(`Creating channel ${entity.channelName}`);

    this.client.getCollection<ChannelEntity>(this.collection).insert(entity);
  }

  public getChannel(name: string): ChannelEntity | null {
    this.logger.debug(`Retrieving channel ${name}`);

    return this.client.getCollection<ChannelEntity>(this.collection).findOne({
      channelName: name,
    });
  }

  public updateChannel(entity: ChannelEntity): void {
    this.logger.log(`Updating channel ${entity.channelName}`);

    this.client.getCollection<ChannelEntity>(this.collection).update(entity);

    this.client.save();
  }

  public delete(channelName: string): void {
    this.client.getCollection<ChannelEntity>(this.collection).removeWhere({
      channelName,
    });
  }
}
