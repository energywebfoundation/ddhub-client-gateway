import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { setupApp } from './helpers/app.helper';
import { MemoryHelper } from './helpers/memory.helper';
import { givenIHaveIdentitySet } from './helpers/identity.helper';
import {
  givenIHaveCreatedTopic,
  givenTopicWithIdNoExists,
} from './helpers/topic.helper';
import { givenICreatedChannel } from './helpers/channel.helper';
import {
  thenMessageResponseShouldContainSuccessfulRecipient,
  thenMessageResponseStatusCodeShouldBe,
  thenReceivedMessagesShouldContainPreviousMessage,
  thenReceivedMessagesStatusCodeShouldBe,
  whenIQueryForMessages,
  whenISendMessage,
} from './helpers/message.helper';
import { clearDatabase } from './helpers/setup.helper';

const feature = loadFeature('../../feature/message.feature', {
  loadRelativePath: true,
});
jest.setTimeout(100000);

describe('Message Feature', () => {
  defineFeature(feature, (test) => {
    let app: INestApplication;

    beforeAll(async () => {
      app = await setupApp();
    });

    const getApp = () => app;

    const testMemory = new MemoryHelper();

    beforeEach(async () => {
      testMemory.map = {};
      await clearDatabase(getApp);
    });

    afterAll(async () => {
      await app.close();
    });

    test('Should send message', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenTopicWithIdNoExists(given, getApp);
      givenIHaveCreatedTopic(given, getApp);
      givenICreatedChannel(given, getApp, testMemory);
      whenISendMessage(when, getApp, testMemory);
      thenMessageResponseStatusCodeShouldBe(then, testMemory);
      thenMessageResponseShouldContainSuccessfulRecipient(then, testMemory);
    });

    test('Should send and receive message', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenTopicWithIdNoExists(given, getApp);
      givenIHaveCreatedTopic(given, getApp);
      givenICreatedChannel(given, getApp, testMemory);
      whenISendMessage(when, getApp, testMemory);
      whenIQueryForMessages(when, getApp, testMemory);
      thenMessageResponseStatusCodeShouldBe(then, testMemory);
      thenMessageResponseShouldContainSuccessfulRecipient(then, testMemory);
      thenReceivedMessagesStatusCodeShouldBe(then, testMemory);
      thenReceivedMessagesShouldContainPreviousMessage(then, testMemory);
    });
  });
});
