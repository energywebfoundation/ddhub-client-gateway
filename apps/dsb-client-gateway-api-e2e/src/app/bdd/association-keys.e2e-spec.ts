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
  whenDeletingOutdatedKeys,
  whenDerivingKeys,
} from './helpers/association-keys.helper';
import { DdhubChannelStreamService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { AssociationKeysWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';

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

  afterEach(async () => {
    const nestApp = getApp();

    const associationKeys = await nestApp
      .get(AssociationKeysWrapperRepository)
      .repository.find({});
    const service = nestApp.get(DdhubChannelStreamService);

    for (const key of associationKeys) {
      await service.deleteStream(key.associationKey);
    }
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

    test('Deleting expiring keys', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenNoAssociationKeysAreGenerated(given, getApp);
      givenTheMnemonicIsSet(given, getApp);
      whenDerivingKeys(when, getApp);
      whenDeletingOutdatedKeys(when, getApp);
      thenIshouldHaveNKeysAvailable(then, getApp);
    });
  });
});
