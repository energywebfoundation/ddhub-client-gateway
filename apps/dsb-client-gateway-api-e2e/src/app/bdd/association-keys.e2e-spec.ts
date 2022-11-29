import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { setupApp } from './helpers/app.helper';
import { MemoryHelper } from './helpers/memory.helper';
import { clearDatabase } from './helpers/setup.helper';
import { givenIHaveIdentitySet } from './helpers/identity.helper';
import {
  givenNoAssociationKeysAreGenerated,
  givenOneAssociationKeyIsAlreadyGenerated,
  givenTheMnemonicIsSet,
  thenAllKeysShouldHaveStatusSent,
  thenDatesOfKeysShouldCrossEachOther,
  thenIshouldHaveNKeysAvailable,
  thenNKeysShouldBeVisibleInResponse,
  whenDerivingKeys,
} from './helpers/association-keys.helper';

const feature = loadFeature('../../feature/association-keys.feature', {
  loadRelativePath: true,
});

jest.setTimeout(1000000);

describe('Association Keys Feature', () => {
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

  defineFeature(feature, (test) => {
    test('Deriving Keys', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenNoAssociationKeysAreGenerated(given, getApp);
      givenTheMnemonicIsSet(given, getApp);
      whenDerivingKeys(when, getApp);
      thenIshouldHaveNKeysAvailable(then, getApp);
      thenDatesOfKeysShouldCrossEachOther(then, getApp);
      thenAllKeysShouldHaveStatusSent(then, getApp);
      thenNKeysShouldBeVisibleInResponse(then, getApp);
    });

    test('Duplicate request for deriving keys', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenNoAssociationKeysAreGenerated(given, getApp);
      givenTheMnemonicIsSet(given, getApp);
      givenOneAssociationKeyIsAlreadyGenerated(given, getApp);
      whenDerivingKeys(when, getApp);
      thenIshouldHaveNKeysAvailable(then, getApp);
      thenDatesOfKeysShouldCrossEachOther(then, getApp);
    });
  });
});
