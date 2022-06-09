import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

export const givenTopicNoExists = (given, app: () => INestApplication) => {
  given(/^There is no topic with the name (.*)$/, async (topicName: string) => {
    const { body } = await request(app().getHttpServer())
      .get('/topics/search?keyword=' + topicName)
      .expect(HttpStatus.OK);

    if (body.count > 0) {
      for (const topic of body.records) {
        if (topic.name === topicName) {
          await request(app().getHttpServer()).delete('/topics/' + topic.id);
        }
      }
    }
  });
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
      await request(app().getHttpServer())
        .post('/topics')
        .send({
          name,
          schema,
          schemaType,
          version,
          owner,
          tags: [tags],
        })
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.schema).toBeDefined();
          expect(body.name).toEqual(name);
          expect(body.owner).toEqual(owner);
          expect(body.version).toEqual(version);
          expect(body.schemaType).toEqual(schemaType);
          expect(body.tags).toEqual([tags]);
        });
    }
  );
};
