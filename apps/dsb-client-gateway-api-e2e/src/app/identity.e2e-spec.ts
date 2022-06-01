import { defineFeature, loadFeature } from 'jest-cucumber';
import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { AppModule } from '../../../dsb-client-gateway-api/src/app/app.module';
import { Test } from '@nestjs/testing';
import { clearSecrets, getVaultPassword } from './helpers/secrets.helper';
import request from 'supertest';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

const feature = loadFeature(
  'apps/dsb-client-gateway-api-e2e/src/feature/identity.feature'
);

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

defineFeature(feature, (test) => {
  let app: INestApplication;
  let response;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register({ shouldValidate: true })],
    })
      .setLogger(new Logger())
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    await clearSecrets(app);
    response = null;
  });

  afterAll(async () => {
    await app.close();
  });

  test('Invalid private key', ({ given, when, then }) => {
    let response;

    given('The system has no identity set', async () => {
      await clearSecrets(app);
    });

    when(/^Invalid (.*) is provided$/, async (invalidPrivateKey) => {
      await request(app.getHttpServer())
        .post('/identity')
        .send({
          privateKey: invalidPrivateKey,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          response = body;
        });
    });

    then('I should get validation error', () => {});
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
          expect(body.err.code).toBe(DsbClientGatewayErrors.ID_NO_PRIVATE_KEY);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  test('Receives identity', ({ given, when, then }) => {
    given('The system has no identity set', async () => {
      await clearSecrets(app);
    });

    when(/^The (.*) is submitted to the system$/, async (privateKey) => {
      await request(app.getHttpServer())
        .post('/identity')
        .send({
          privateKey: await getVaultPassword(privateKey),
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          response = body;
        });
    });

    then(/^I should get in POST response (.*)$/, (address) => {
      expect(response.address).toEqual(address);
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
