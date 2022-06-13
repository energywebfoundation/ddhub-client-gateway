import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../dsb-client-gateway-api/src/app/app.module';
import { givenIHaveIdentitySet } from './helpers/identity.helper';
import { givenEnrolmentStatus } from './helpers/enrolment.helper';
import {
  givenTopicNoExists,
  whenTopicWasRegisteredItShouldExists,
  whenUserCreatesTopic,
} from './helpers/topic.helper';

const feature = loadFeature('../feature/topic.feature', {
  loadRelativePath: true,
});

jest.setTimeout(100000);

describe('Topic Feature', () => {
  let app: INestApplication;

  const getApp = () => app;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register({ shouldValidate: true })],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  defineFeature(feature, (test) => {
    test('Create a topic', ({ given, when, then }) => {
      givenIHaveIdentitySet(given, getApp);
      givenEnrolmentStatus(given, getApp);
      givenTopicNoExists(given, getApp);
      whenUserCreatesTopic(when, getApp);
      whenTopicWasRegisteredItShouldExists(then, getApp);
    });
  });
});
