export interface ChannelQualifiedDids {
  fqcn: string;
  qualifiedDids: string[];
  updatedAt: string;
}

export interface TopicVersionEntity {
  name: string;
  owner: string;
  schema: object;
  schemaType: string;
  tags: string[];
  version: string;
  topicId: string;
}

export interface TopicEntity {
  id: string;
  name: string;
  schemaType: string;
  schema: object;
  owner: string;
  version: string;
}
