import { AppModule } from '../../app/app.module';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { StorageService } from '../../app/modules/storage/service/storage.service';

jest.setTimeout(20000);

describe.skip('IdentityController (E2E)', () => {
  let app: INestApplication;
  let storageService: StorageService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    storageService = moduleRef.get<StorageService>(StorageService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await storageService.writeIdentity({} as any);
  });

  describe('/POST identity', () => {
    it('Should create identity using private key', async () => {
      const privateKey =
        '0x91dd4d74e51dec309f322ee752b817ddadeab2df4fda75d7db8de49ac35dd78e';

      await request(app.getHttpServer())
        .post('/identity')
        .send({
          privateKey,
        })
        .expect(201);

      const { body } = await request(app.getHttpServer())
        .get('/identity')
        .expect(200);

      expect(body.publicKey).toBeDefined();
      expect(body.balance).toEqual('NONE');
      expect(body.address).toBeDefined();
      expect(body.privateKey).toBeDefined();
    });

    it('Should create identity without private key', async () => {
      await request(app.getHttpServer()).post('/identity').expect(201);

      const { body } = await request(app.getHttpServer())
        .get('/identity')
        .expect(200);

      expect(body.publicKey).toBeDefined();
      expect(body.balance).toEqual('NONE');
      expect(body.address).toBeDefined();
      expect(body.privateKey).toBeDefined();
    });
  });

  describe('/GET identity', () => {
    it(`Should return not found as identity is not set`, async () => {
      await request(app.getHttpServer()).get('/identity').expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
