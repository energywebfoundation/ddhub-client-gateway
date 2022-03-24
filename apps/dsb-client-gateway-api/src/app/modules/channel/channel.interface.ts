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
}
