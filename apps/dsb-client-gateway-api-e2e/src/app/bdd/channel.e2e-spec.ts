import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { givenIHaveIdentitySet } from './helpers/identity.helper';
import {
  givenICreatedChannel,
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
import { MemoryHelper } from './helpers/memory.helper';
import { thenResponseMemTypeShouldBe } from './helpers/response.helper';

const feature = loadFeature('../../feature/channel.feature', {
  loadRelativePath: true,
});

jest.setTimeout(1000000);

describe('Channel Feature', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupApp();
  });

  const getApp = () => app;

  afterAll(async () => {
    await app.close();
  });

  const testMemory = new MemoryHelper();

  beforeEach(async () => {
    testMemory.map = {};
    await clearDatabase(getApp);
  });

  afterEach(() => {
    console.log(testMemory.map);
  });

  defineFeature(feature, (test) => {
    test('Should delete channel', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      givenICreatedChannel(given, getApp, testMemory);
      whenISendDeleteRequest(when, getApp, testMemory);
      thenResponseMemTypeShouldBe(when, testMemory);
      thenIShouldNotReceiveChannelEntity(then, getApp);
    });

    test('Should create channel', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      givenTopicWithIdNoExists(given, getApp);
      givenIHaveCreatedTopic(given, getApp);
      whenICreateChannel(when, getApp, testMemory);
      thenResponseMemTypeShouldBe(when, testMemory);
      thenIShouldReceiveChannelEntity(then, getApp);
    });

    test('Should update channel payload encryption', ({
      given,
      when,
      then,
    }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      givenICreatedChannel(given, getApp, testMemory);
      whenIUpdatePayloadEncryption(when, getApp);
      thenPayloadEncryptionShouldBeUpdated(then, getApp);
    });

    test('Should receive qualified dids', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);
      whenICreateChannel(when, getApp, testMemory);
      thenChannelShouldHaveQualifiedDids(then, getApp);
    });

    test('Receives empty list of channels', ({ given, when, then }) => {
      let response;

      givenIHaveIdentitySet(given, getApp);
      givenIHaveEmptyListOfChannels(given, getApp);

      when('I ask for channels', async () => {
        await request(app.getHttpServer())
          .get('/channels')
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
