import { ChannelEntity } from '../entity/channel.entity';
import { EntityRepository, In, Repository } from 'typeorm';
import { ChannelType } from '@dsb-client-gateway/dsb-client-gateway-storage';

export interface ChannelsHavingTopic {
  c: {
    topicName: string;
    owner: string;
    topicId: string;
    schemaType: string;
  };
  fqcn: string;
}

@EntityRepository(ChannelEntity)
export class ChannelRepository extends Repository<ChannelEntity> {
  public async getChannelsHavingTopics(
    topicName: string,
    topicOwner: string,
    topicId: string,
  ): Promise<ChannelsHavingTopic[]> {
    return this.query(
      `
      select * from (select json_array_elements(conditions::json->'topics') as c, fqcn from channels) t where t.c->>'topicName' = $1 AND t.c->>'owner' = $2 AND t.c->>'topicId' = $3
    `,
      [topicName, topicOwner, topicId],
    );
  }

  public async getManyByFQCN(fqcn: string[]): Promise<ChannelEntity[]> {
    return this.find({
      where: {
        fqcn: In(fqcn),
      },
    });
  }

  public async getChannelsByType(type?: ChannelType): Promise<ChannelEntity[]> {
    return this.find({
      where: {
        ...(type ? { type } : null),
      },
    });
  }

  public async getAll(): Promise<ChannelEntity[]> {
    return this.find();
  }

  public async getAllQualifiedDids(): Promise<string[]> {
    const channelConditions: Pick<ChannelEntity, 'conditions'>[] =
      await this.find({
        select: ['conditions'],
      });

    const dids: string[] = channelConditions.reduce((acc, currentValue) => {
      currentValue.conditions.qualifiedDids.forEach((did) => acc.push(did));

      return acc;
    }, []);

    return [...new Set(dids)];
  }

  public async drop(fqcn: string): Promise<void> {
    await this.delete({
      fqcn,
    });
  }
}
