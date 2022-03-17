import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../dsb-client-gateway-api/src/app/app.module';
import { DsbApiService } from '../../../dsb-client-gateway-api/src/app/modules/dsb-client/service/dsb-api.service';
import { IamFactoryService } from '../../../dsb-client-gateway-api/src/app/modules/iam-service/service/iam-factory.service';
import { CreateChannelDto } from '../../../dsb-client-gateway-api/src/app/modules/channel/dto/request/create-channel.dto';
import { ChannelType } from '../../../dsb-client-gateway-api/src/app/modules/channel/channel.const';
import { clearDatabase } from './utils/lokijs-utils';
import { ChannelRepository } from '../../../dsb-client-gateway-api/src/app/modules/channel/repository/channel.repository';
import { DsbClientGatewayErrors } from '@dsb-client-gateway/dsb-client-gateway-errors';

jest.setTimeout(500000);

const setupPrivateKey = async (app: INestApplication) => {
  await request(app.getHttpServer()).post('/identity').send().expect(201);
};

const dsbApiServiceMock = {
  getTopicsByOwnerAndName: jest.fn(),
};

const requestBody: Partial<CreateChannelDto> = {
  channelName: 'channelname',
  type: ChannelType.SUB,
  conditions: {
    dids: ['did:ethr:volta:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2'],
    roles: ['messagebroker.roles123'],
    topics: [
      {
        topicName: 'test',
        owner: 'test',
      },
    ],
  },
};

describe('ChannelController (E2E)', () => {
  let app: INestApplication;
  let loki;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DsbApiService)
      .useValue(dsbApiServiceMock)
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

    const repository = app.get(ChannelRepository);

    loki = repository.client;
  });

  afterEach(async () => {
    await clearDatabase(loki);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    await clearDatabase(loki);

    await setupPrivateKey(app);
  });

  describe('/PUT channel', () => {
    it('should update channel', async () => {
      dsbApiServiceMock.getTopicsByOwnerAndName = jest
        .fn()
        .mockImplementation(async () => ({
          count: 1,
          limit: 1,
          page: 1,
          records: [
            {
              id: 'RANDOM_ID',
              namespace: 'test',
              owner: 'test',
              schema: '',
              schemaType: '',
              version: '',
            },
          ],
        }));

      const channelName = 'channel.put.1';

      await request(app.getHttpServer())
        .post('/channel')
        .send({
          ...requestBody,
          channelName,
        })
        .expect(({ body }) => {
          expect(body).toEqual({});
        })
        .expect(201);

      const newConditions = {
        dids: ['did:ethr:volta:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2'],
        roles: ['messagebroker.roles.updated'],
        topics: [
          {
            topicName: 'test',
            owner: 'test',
          },
        ],
      };

      await request(app.getHttpServer())
        .put('/channel')
        .send({
          ...requestBody,
          channelName,
          conditions: newConditions,
        })
        .expect(({ body }) => {
          expect(body).toEqual({});
        })
        .expect(200);

      await request(app.getHttpServer())
        .get('/channel/' + channelName)
        .expect(({ body }) => {
          delete body['createdAt'];
          delete body['updatedAt'];

          expect(body).toEqual({
            channelName,
            type: 'sub',
            conditions: {
              topics: [
                {
                  topicName: 'test',
                  owner: 'test',
                  topicId: 'RANDOM_ID',
                },
              ],
              dids: [
                'did:ethr:volta:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2',
              ],
              roles: ['messagebroker.roles.updated'],
            },
          });
        })
        .expect(200);
    });
  });

  describe('/GET channel', () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      await clearDatabase(loki);

      await setupPrivateKey(app);
    });

    describe('Validation testing', () => {
      it('should reject - channel name is uppercase', async () => {
        await request(app.getHttpServer())
          .get('/channel/INVALID')
          .expect(({ body }) => {
            expect(body.statusCode).toEqual(400);
            expect(body.err.reason.length).toBe(1);
            expect(body.err.reason[0]).toBe(
              'INVALID is invalid channel name. Should contain only alphanumeric lowercase letters, use . as a separator. Max length 255'
            );
          })
          .expect(400);
      });

      it('should return not found - channel does not exists', async () => {
        await request(app.getHttpServer())
          .get('/channel/channel1')
          .expect(({ body }) => {
            expect(body.statusCode).toEqual(404);
            expect(body.err.reason).toBe('Channel not found');
          })
          .expect(404);
      });

      it('should return channel', async () => {
        dsbApiServiceMock.getTopicsByOwnerAndName = jest
          .fn()
          .mockImplementation(async () => ({
            count: 1,
            limit: 1,
            page: 1,
            records: [
              {
                id: 'RANDOM_ID',
                namespace: 'test',
                owner: 'test',
                schema: '',
                schemaType: '',
                version: '',
              },
            ],
          }));

        const channelName = 'test10';

        await request(app.getHttpServer())
          .post('/channel')
          .send({
            ...requestBody,
            channelName,
          })
          .expect(({ body }) => {
            expect(body).toEqual({});
          })
          .expect(201);

        await request(app.getHttpServer())
          .get('/channel/' + channelName)
          .expect(({ body }) => {
            delete body['createdAt'];
            delete body['updatedAt'];

            expect(body).toEqual({
              channelName: 'test10',
              type: 'sub',
              conditions: {
                topics: [
                  {
                    topicName: 'test',
                    owner: 'test',
                    topicId: 'RANDOM_ID',
                  },
                ],
                dids: [
                  'did:ethr:volta:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2',
                ],
                roles: ['messagebroker.roles123'],
              },
            });
          })
          .expect(200);
      });
    });
  });

  describe('/POST channel', () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      await clearDatabase(loki);

      await setupPrivateKey(app);
    });

    it('should create channel', async () => {
      dsbApiServiceMock.getTopicsByOwnerAndName = jest
        .fn()
        .mockImplementation(async () => ({
          count: 1,
          limit: 1,
          page: 1,
          records: [
            {
              id: 'RANDOM_ID',
              namespace: 'test',
              owner: 'test',
              schema: '',
              schemaType: '',
              version: '',
            },
          ],
        }));

      await request(app.getHttpServer())
        .post('/channel')
        .send({
          ...requestBody,
          channelName: 'test3',
        })
        .expect(({ body }) => {
          expect(body).toEqual({});
        })
        .expect(201);
    });

    it('should not create channel - specified topic does not exists', async () => {
      dsbApiServiceMock.getTopicsByOwnerAndName = jest
        .fn()
        .mockImplementation(async () => ({
          count: 0,
          limit: 0,
          page: 0,
          records: [],
        }));

      await request(app.getHttpServer())
        .post('/channel')
        .send({
          ...requestBody,
          channelName: 'test4',
        })
        .expect(({ body }) => {
          expect(body.err.code).toBe(DsbClientGatewayErrors.TOPIC_NOT_FOUND);
          expect(body.statusCode).toEqual(400);
        })
        .expect(400);
    });

    it('should reject channel creation - channel already exists', async () => {
      dsbApiServiceMock.getTopicsByOwnerAndName = jest
        .fn()
        .mockImplementation(async () => ({
          count: 1,
          limit: 1,
          page: 1,
          records: [
            {
              id: 'RANDOM_ID',
              namespace: 'test',
              owner: 'test',
              schema: '',
              schemaType: '',
              version: '',
            },
          ],
        }));

      await request(app.getHttpServer())
        .post('/channel')
        .send({
          ...requestBody,
          channelName: 'test2',
        })
        .expect(({ body }) => {
          expect(body).toEqual({});
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/channel')
        .send({
          ...requestBody,
          channelName: 'test2',
        })
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(400);
          expect(body.err.code).toBe(
            DsbClientGatewayErrors.CHANNEL_ALREADY_EXISTS
          );
        })
        .expect(400);
    });

    describe('Validation testing', () => {
      beforeEach(async () => {
        dsbApiServiceMock.getTopicsByOwnerAndName = jest
          .fn()
          .mockImplementation(async () => ({
            count: 0,
            limit: 0,
            page: 0,
            records: [],
          }));
      });

      it('should reject because channel name format is invalid', async () => {
        const invalidChannelName = 'test asdaas $!@@#$!$';

        await request(app.getHttpServer())
          .post('/channel')
          .send({
            ...requestBody,
            channelName: invalidChannelName,
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.statusCode).toBe(400);
            expect(body.err.reason.length).toBe(1);
            expect(body.err.reason[0].includes(invalidChannelName)).toBe(true);
          });
      });

      it('should reject because channel type is invalid', async () => {
        await request(app.getHttpServer())
          .post('/channel')
          .send({
            ...requestBody,
            type: 'INVALID',
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.statusCode).toBe(400);
            expect(body.err.reason.length).toBe(1);
            expect(body.err.reason[0]).toBe('type must be a valid enum value');
          });
      });

      it('should reject because topics are duplicated', async () => {
        await request(app.getHttpServer())
          .post('/channel')
          .send({
            ...requestBody,
            conditions: {
              dids: [],
              roles: [],
              topics: [
                {
                  topicName: 'test',
                  owner: 'test',
                },
                {
                  topicName: 'test',
                  owner: 'test',
                },
              ],
            },
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.statusCode).toBe(400);
            expect(body.err.reason.length).toBe(1);
            expect(body.err.reason[0]).toBe(
              "conditions.All topics's elements must be unique"
            );
          });
      });

      it('should reject because DID is malformed', async () => {
        await request(app.getHttpServer())
          .post('/channel')
          .send({
            ...requestBody,
            conditions: {
              dids: ['MALFORMED_DID'],
              roles: [],
              topics: [
                {
                  topicName: 'test',
                  owner: 'test',
                },
              ],
            },
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.statusCode).toBe(400);
            expect(body.err.reason.length).toBe(1);
            expect(body.err.reason[0]).toBe('conditions.Malformed DID');
          });
      });
    });
  });
});
