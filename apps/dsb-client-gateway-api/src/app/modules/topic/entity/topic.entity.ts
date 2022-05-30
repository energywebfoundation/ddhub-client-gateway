export interface Topic {
  id: string;
  name: string;
  schemaType: string;
  schema: object;
  tags: string[];
  owner: string;
  version: string;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface GetTopicResponse {
  count: number;
  limit: number;
  page: number;
  records: Topic[];
}
