import { defineFeature, loadFeature } from 'jest-cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearSecrets } from './helpers/secrets.helper';
import request from 'supertest';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { setupApp } from './helpers/app.helper';
import { MemoryHelper } from './helpers/memory.helper';

const feature = loadFeature('../../feature/identity.feature', {
  loadRelativePath: true,
});
jest.setTimeout(100000);

const roleExists = (
  roles: Array<any>,
  userRole,
  application,
  enrolmentState
): boolean => {
  const fullRoleName = `${userRole}.${application}`;

  return roles.some(
    ({ namespace, status }) =>
      namespace === fullRoleName && status === enrolmentState
  );
};

describe('Identity Feature', () => {
  defineFeature(feature, (test) => {
    let app: INestApplication;

    beforeAll(async () => {
      app = await setupApp();
    });

    const testMemory = new MemoryHelper();

    beforeEach(async () => {
      testMemory.map = {};
    });

    afterAll(async () => {
      await app.close();
    });

    test('Invalid private key', ({ given, when, then }) => {
      given('The system has no identity set', async () => {
        await clearSecrets(app);
      });

      when(/^Invalid (.*) is provided$/, async (invalidPrivateKey) => {
        await request(app.getHttpServer())
          .post('/identity')
          .send({
            privateKey: invalidPrivateKey,
          })
          .expect(({ body }) => {
            testMemory.map.INVALID_PRIVATE_KEY_RESPONSE_BODY = body;
          });
      });

      then('I should get validation error', () => {
        expect(testMemory.map.INVALID_PRIVATE_KEY_RESPONSE_BODY.err.code).toBe(
          'ID::INVALID_PRIVATE_KEY'
        );
      });
    });

    test('No private key', ({ given, when, then }) => {
      given('The system has no identity set', async () => {
        await clearSecrets(app);
      });

      when('No private key is provided', () => {
        expect(true).toBe(true);
      });

      then('I should get no private key error', async () => {
        await request(app.getHttpServer())
          .get('/identity')
          .expect(({ body }) => {
            expect(body.err.code).toBe(
              DsbClientGatewayErrors.ID_NO_PRIVATE_KEY
            );
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    test('Receives identity', ({ given, when, then }) => {
      given('The system has no identity set', async () => {
        await clearSecrets(app);
      });

      when(/^The private key is submitted to the system$/, async () => {
        await request(app.getHttpServer())
          .post('/identity')
          .send({
            privateKey: process.env.PRIVATE_KEY_E2E,
          })
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            testMemory.map.VALID_PRIVATE_KEY_RESPONSE_BODY = body;
          });
      });

      then(/^I should get in POST response (.*)$/, (address) => {
        expect(testMemory.map.VALID_PRIVATE_KEY_RESPONSE_BODY.address).toEqual(
          address
        );
      });

      then(
        /^The (.*) has its enrolment state equals to (.*) for the application (.*) and role is SYNCED$/,
        async (userRole, enrolmentState, application) => {
          await request(app.getHttpServer())
            .get('/identity')
            .expect(HttpStatus.OK)
            .expect(({ body }) => {
              expect(
                roleExists(
                  body.enrolment.roles,
                  userRole,
                  application,
                  enrolmentState
                )
              ).toBe(true);
            });
        }
      );

      then(
        /^The signature key and public RSA key should exists in DID document for (.*)$/,
        async (address) => {
          const iamService = app.get(IamService);

          const didAddress = 'did:ethr:volta:' + address;
          const did = await iamService.getDid(didAddress);

          const keys = did.publicKey.filter((publicKey) => {
            return (
              publicKey.id === didAddress + '#dsb-signature-key' ||
              publicKey.id === didAddress + '#dsb-symmetric-encryption'
            );
          });

          expect(keys.length).toBe(2);
        }
      );
    });
  });
});
