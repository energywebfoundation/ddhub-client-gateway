import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import fs from 'fs';
import { PostTopicBodyDto } from '../../../../../dsb-client-gateway-api/src/app/modules/topic/dto';
import {
  DdhubTopicsService,
  TopicDataResponse,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

const loadTopic = (topicPayloadId: string): PostTopicBodyDto => {
  const topicPayload: PostTopicBodyDto = JSON.parse(
    fs
      .readFileSync(
        __dirname + '/../../../feature/testResources/topic/' + topicPayloadId
      )
      .toString()
  ) as unknown as PostTopicBodyDto;

  return topicPayload;
};

const deleteTopic = async (
  app: () => INestApplication,
  topicName: string
): Promise<void> => {
  const ddhubTopicsService = await app().get(DdhubTopicsService);

  const r: TopicDataResponse = (await ddhubTopicsService.getTopicsBySearch(
    topicName,
    undefined,
    5,
    1
  )) as TopicDataResponse;

  if (Array.isArray(r) && !r.length) {
    return;
  }

  for (const topic of r.records) {
    if (topic.name === topicName) {
      await request(app().getHttpServer()).delete('/topics/' + topic.id);
    }
  }
};

const createTopic = async (
  schemaType: string,
  schema: string,
  version: string,
  owner: string,
  tags: string[],
  name: string,
  app: () => INestApplication
): Promise<void> => {
  await request(app().getHttpServer())
    .post('/topics')
    .send({
      name,
      schema,
      schemaType,
      version,
      owner,
      tags,
    })
    .expect(({ body }) => {
      console.log(body);
      expect(body.id).toBeDefined();
      expect(body.schema).toBeDefined();
      expect(body.name).toEqual(name);
      expect(body.owner).toEqual(owner);
      expect(body.version).toEqual(version);
      expect(body.schemaType).toEqual(schemaType);
      expect(body.tags).toEqual(tags);
    })
    .expect(HttpStatus.CREATED);
};

export const givenIHaveCreatedTopic = (given, app: () => INestApplication) => {
  given(
    /^The topic was created with payload (.*)$/,
    async (topicPayloadId: string) => {
      const topicPayload: PostTopicBodyDto = loadTopic(topicPayloadId);

      await createTopic(
        topicPayload.schemaType,
        topicPayload.schema,
        topicPayload.version,
        topicPayload.owner,
        topicPayload.tags,
        topicPayload.name,
        app
      );
    }
  );
};

export const givenTopicNoExists = (given, app: () => INestApplication) => {
  given(/^There is no topic with the name (.*)$/, async (topicName: string) => {
    await deleteTopic(app, topicName);
  });
};

export const givenTopicWithIdNoExists = (
  given,
  app: () => INestApplication
) => {
  given(
    /^The topic with (.*) does not exists$/,
    async (topicPayloadId: string) => {
      const topicPayload: PostTopicBodyDto = loadTopic(topicPayloadId);

      await deleteTopic(app, topicPayload.name);
    }
  );
};

export const whenTopicWasRegisteredItShouldExists = (
  then,
  app: () => INestApplication
) => {
  then(
    /^a new topic is registered in storage with the name (.*)$/,
    async (name) => {
      const { body } = await request(app().getHttpServer())
        .get('/topics/search?keyword=' + name)
        .expect(HttpStatus.OK);

      expect(body.count).toBe(1);
      expect(body.records[0].name).toEqual(name);
    }
  );
};

export const whenUserCreatesTopic = (when, app: () => INestApplication) => {
  when(
    /^The user submit (.*), (.*), (.*), (.*), (.*) to create the (.*) topic$/,
    async (
      schemaType: string,
      schema: string,
      version: string,
      owner: string,
      tags: string,
      name: string
    ) => {
      await createTopic(schemaType, schema, version, owner, [tags], name, app);
    }
  );
};
