import { defineFeature, loadFeature } from 'jest-cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { givenIHaveIdentitySet } from './helpers/identity.helper';
import {
  givenIHaveEmptyListOfChannels,
  thenChannelShouldHaveQualifiedDids,
  thenIShouldNotReceiveChannelEntity,
  thenIShouldReceiveChannelEntity,
  thenPayloadEncryptionShouldBeUpdated,
  whenICreateChannel,
  whenISendDeleteRequest,
  whenIUpdatePayloadEncryption,
} from './helpers/channel.helper';
import request from 'supertest';
import { setupApp } from './helpers/app.helper';
import {
  givenIHaveCreatedTopic,
  givenTopicWithIdNoExists,
} from './helpers/topic.helper';
import { clearDatabase } from './helpers/setup.helper';

const feature = loadFeature('../../feature/channel.feature', {
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

  beforeEach(async () => {
    await clearDatabase(getApp);
  });

  defineFeature(feature, (test) => {
    test('Should delete channel', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      whenICreateChannel(when, getApp);
      whenISendDeleteRequest(when, getApp);
      thenIShouldNotReceiveChannelEntity(then, getApp);
    });

    test('Should create channel', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      givenTopicWithIdNoExists(given, getApp);
      givenIHaveCreatedTopic(given, getApp);
      whenICreateChannel(when, getApp);
      thenIShouldReceiveChannelEntity(then, getApp);
    });

    test('Should update channel payload encryption', ({
      given,
      when,
      then,
    }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      whenICreateChannel(when, getApp);
      whenIUpdatePayloadEncryption(when, getApp);
      thenPayloadEncryptionShouldBeUpdated(then, getApp);
    });

    test('Should receive qualified dids', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      whenICreateChannel(when, getApp);
      thenChannelShouldHaveQualifiedDids(then, getApp);
    });

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
