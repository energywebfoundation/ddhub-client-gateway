import { ChannelEntity } from '../entity/channel.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ChannelType } from '../../../../../../../apps/dsb-client-gateway-api/src/app/modules/channel/channel.const';

@EntityRepository(ChannelEntity)
export class ChannelRepository extends Repository<ChannelEntity> {
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
