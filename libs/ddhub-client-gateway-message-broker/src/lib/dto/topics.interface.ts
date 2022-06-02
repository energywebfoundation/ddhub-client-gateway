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
  schemaType: string;
  tags: string[];
}

export interface Topic {
  id: string;
  schema: object | string;
  version: string;
  owner: string;
  name: string;
  schemaType: string;
}

export interface TopicResultDTO {
  id: string;
  name: string;
  schemaType: string;
  owner: string;
  tags: string[];
}

export interface UpdateTopicBodyDTO {
  tags: string[];
}

export interface UpdateTopicHistoryDTO {
  schema: string;
}

export type TopicVersionResponse = PaginatedData<TopicVersion>;
export type TopicDataResponse = PaginatedData<Topic>;
