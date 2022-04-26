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

  public async drop(fqcn: string): Promise<void> {
    await this.delete({
      fqcn,
    });
  }
}
