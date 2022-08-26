import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TopicDeletedCommand } from '../command/topic-deleted.command';
import {
  ChannelsHavingTopic,
  ChannelWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Logger } from '@nestjs/common';

@CommandHandler(TopicDeletedCommand)
export class TopicDeletedHandler
  implements ICommandHandler<TopicDeletedCommand>
{
  protected readonly logger = new Logger(TopicDeletedHandler.name);

  constructor(protected readonly channelWrapper: ChannelWrapperRepository) {}

  public async execute(command: TopicDeletedCommand): Promise<void> {
    const res: ChannelsHavingTopic[] =
      await this.channelWrapper.channelRepository.getChannelsHavingTopics(
        command.topicName,
        command.topicOwner
      );

    if (res.length === 0) {
      this.logger.log(
        `no matching channels found for ${command.topicName}-${command.topicOwner}`
      );

      return;
    }

    const channels = await this.channelWrapper.channelRepository.getManyByFQCN(
      res.map((c) => c.fqcn)
    );

    for (const channel of channels) {
      try {
        channel.conditions.topics = channel.conditions.topics.filter((c) => {
          return (
            c.topicName !== command.topicName && c.owner !== command.topicOwner
          );
        });

        await this.channelWrapper.channelRepository.save(channel);

        this.logger.log(
          `removed ${command.topicName}-${command.topicOwner} from ${channel.fqcn}`
        );
      } catch (e) {
        this.logger.error(
          'failed during removing topic from channel ' + channel.fqcn
        );
        this.logger.error(e);
      }
    }
  }
}
