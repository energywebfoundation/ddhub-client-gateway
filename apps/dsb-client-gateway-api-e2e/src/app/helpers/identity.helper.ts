import { HttpStatus } from '@nestjs/common';
import { getVaultPassword } from './secrets.helper';
import request from 'supertest';
import { Wallet } from 'ethers';

export const givenIHaveIdentitySet = (given, fn) => {
  given(
    /^The system has identity set with (.*)$/,
    async (privateKeyId: string) => {
      const privateKey = await getVaultPassword(privateKeyId);
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
    }
  );
};
