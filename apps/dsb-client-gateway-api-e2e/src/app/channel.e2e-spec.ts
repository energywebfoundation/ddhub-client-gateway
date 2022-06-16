import { defineFeature, loadFeature } from 'jest-cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { givenIHaveIdentitySet } from './helpers/identity.helper';
import { givenIHaveEmptyListOfChannels } from './helpers/channel.helper';
import request from 'supertest';
import { setupApp } from './helpers/app.helper';

const feature = loadFeature('../feature/channel.feature', {
  loadRelativePath: true,
});

jest.setTimeout(100000);

describe('Channel Feature', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupApp();
  });

  const getApp = () => app;

  afterAll(async () => {
    await app.close();
  });

  defineFeature(feature, (test) => {
    test('Receives empty list of channels', ({ given, when, then }) => {
      let response;

      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);

      when('I ask for channels', async () => {
        await request(app.getHttpServer())
          .get('/channels')
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            response = body;
          });
      });

      then('I should receive empty list of channels', async () => {
        expect(response).toEqual([]);
      });
    });
  });
});
