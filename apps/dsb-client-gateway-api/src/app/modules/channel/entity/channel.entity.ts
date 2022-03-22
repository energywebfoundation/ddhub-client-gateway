import { ChannelType } from '../channel.const';

export class ChannelTopic {
  topicName: string;
  owner: string;
  topicId: string;
}

export class ChannelConditions {
  dids: string[];
  roles: string[];
  topics: ChannelTopic[];
}

export class ChannelEntity {
  channelName: string;
  type: ChannelType;
  conditions: ChannelConditions;
  createdAt: string;
  updatedAt: string;
}
