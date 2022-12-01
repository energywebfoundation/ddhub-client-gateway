import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { Wallet } from 'ethers';

export const givenIHaveIdentitySet = (given, fn) => {
  given(/^The system has identity set$/, async () => {
    const privateKey = process.env.PRIVATE_KEY_E2E;
    const wallet = new Wallet(privateKey);

    await request(fn().getHttpServer())
      .post('/identity')
      .send({
        privateKey,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.address).toBe(wallet.address);
      });
  });
};
