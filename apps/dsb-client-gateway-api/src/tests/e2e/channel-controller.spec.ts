import { Test } from '@nestjs/testing';
import { AppModule } from '../../app/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IamFactoryService } from '../../app/modules/iam-service/service/iam-factory.service';
import { DidAuthApiService } from '../../app/modules/dsb-client/module/did-auth/service/did-auth-api.service';

jest.setTimeout(500000);

const setupPrivateKey = async (app: INestApplication) => {
  const privateKey =
    '0x91dd4d74e51dec309f322ee752b817ddadeab2df4fda75d7db8de49ac35dd78e';

  await request(app.getHttpServer())
    .post('/identity')
    .send({
      privateKey,
    })
    .expect(201);
};

const didAuthProxyMockService = {
  login: jest.fn(),
};

describe('ChannelController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DidAuthApiService)
      .useValue(didAuthProxyMockService)
      .overrideProvider(IamFactoryService)
      .useValue({
        initialize: async () => {
          return {
            cacheClient: {},
            didRegistry: {},
            signerService: {},
            claimsService: {},
          };
        },
      })
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    await setupPrivateKey(app);
  });

  describe('/POST channel', () => {
    describe('Validation testing', () => {
      it('should reject because channel name format is invalid', async () => {
        const invalidChannelName = 'invalid$$$$channel';

        await request(app.getHttpServer())
          .post('/channel')
          .send({
            channelName: invalidChannelName,
            type: 'pub',
            conditions: {
              dids: [
                'did:ethr:volta:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2',
              ],
              roles: ['messagebroker.roles123'],
              topics: [
                {
                  topicName: 'test',
                  owner: 'test',
                },
              ],
            },
          })
          .expect(400);
      });
    });
  });
});
