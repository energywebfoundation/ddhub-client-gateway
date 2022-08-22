export enum SchemaType {
  JSD7 = 'JSD7',
  XSD6 = 'XSD6',
  XML = 'XML',
  CSV = 'CSV',
  TSV = 'TSV',
}

export interface PaginatedData<T> {
  count: number;
  limit: number;
  page: number;
  records: T[];
}

export interface TopicVersion {
  id: string;
  schema: object;
  version: string;
  owner: string;
  name: string;
  schemaType: SchemaType;
  tags: string[];
}

export interface Topic {
  id: string;
  name: string;
  schemaType: SchemaType;
  schema: string;
  version: string;
  owner: string;
  tags: string[];
  createdDate?: string;
  updatedDate?: string;
}

export interface PostTopicBodyDto {
  name: string;
  schemaType: SchemaType;
  schema: string;
  version: string;
  owner: string;
  tags: string[];
}

export interface TopicCountDto {
  count: number;
  owner: string;
}
export interface UpdateTopicResponeDto {
  id: string;
  name: string;
  schemaType: SchemaType;
  owner: string;
  tags: string[];
}

export interface DeleteTopicResponseDto {
  timestamp: string;
  returnCode: string;
  returnMessage: string;
}

export interface UpdateTopicBodyDTO {
  tags: string[];
}

export interface UpdateTopicHistoryDTO {
  schema: string;
}

export type TopicVersionResponse = PaginatedData<TopicVersion>;
export type TopicDataResponse = PaginatedData<Topic>;

export interface TopicMonitorUpdates {
  id: string;
  owner: string;
  lastTopicUpdate: string;
  lastTopicVersionUpdate: string;
}
