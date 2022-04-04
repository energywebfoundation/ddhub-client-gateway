import { ChannelType } from '../channel.const';
import { TopicVersion } from '../../dsb-client/dsb-client.interface';

export class ChannelTopic {
  topicName: string;
  owner: string;
  topicId: string;
}

export class ChannelConditions {
  dids: string[];
  roles: string[];
  topics: ChannelTopic[];
  topicsVersions: { [topicId: string]: TopicVersion[] };
  qualifiedDids: string[];
}

export class ChannelEntity {
  fqcn: string;
  type: ChannelType;
  conditions: ChannelConditions;
  createdAt: string;
  updatedAt: string;
}
