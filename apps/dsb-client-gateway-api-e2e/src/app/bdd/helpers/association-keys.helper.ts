import { HttpStatus, INestApplication } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { AssociationKeysWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import moment from 'moment';
import request from 'supertest';

export const givenTheMnemonicIsSet = (given, app: () => INestApplication) => {
  given(/^The (.*) mnenomic is set$/, async (mnemonic: string) => {
    await app().get(SecretsEngineService).setMnemonic(mnemonic);
  });
};

export const givenNoAssociationKeysAreGenerated = (
  given,
  app: () => INestApplication
) => {
  given('No association keys are generated', async () => {
    await app().get(AssociationKeysWrapperRepository).repository.clear();
  });
};

export const givenOneAssociationKeyIsAlreadyGenerated = (
  given,
  app: () => INestApplication
) => {
  given(
    /^One association key is already generated for (.*)$/,
    async (date: string) => {
      await app()
        .get(AssociationKeysWrapperRepository)
        .repository.save({
          validFrom: moment(date).toDate(),
          validTo: moment(date).add(1, 'hour').toDate(),
          associationKey: 'test',
          iteration: 'random',
          sentDate: null,
          isSent: false,
          owner: 'DID',
        });
    }
  );
};

export const whenDerivingKeys = (when, app: () => INestApplication) => {
  when(/^Deriving keys for (.*)$/, async (date: string) => {
    await app()
      .get(AssociationKeysService)
      .derivePublicKeys(moment(date).toDate());
  });
};

export const thenIshouldHaveNKeysAvailable = (
  then,
  app: () => INestApplication
) => {
  then(
    /^I should have at least (.*) association keys available$/,
    async (keys: number) => {
      const allKeys = await app()
        .get(AssociationKeysWrapperRepository)
        .repository.find();

      expect(allKeys.length).toBe(+keys);
    }
  );
};

export const thenAllKeysShouldHaveStatusSent = (
  then,
  app: () => INestApplication
) => {
  then('All keys should have status sent', async (keys: number) => {
    const allKeys = await app()
      .get(AssociationKeysWrapperRepository)
      .repository.find();

    expect(allKeys.length).toBeGreaterThanOrEqual(1);

    for (const key of allKeys) {
      expect(key.isSent).toBeTruthy();
      expect(key.sentDate).toBeDefined();
    }
  });
};

export const thenNKeysShouldBeVisibleInResponse = (
  then,
  app: () => INestApplication
) => {
  then('Keys should be visible in response', async () => {
    const keys = await request(app().getHttpServer())
      .get('/keys/association/current')
      .expect(({ body }) => {
        console.log(body);
      })
      .expect(HttpStatus.OK);

    expect(keys.body.current).toBeDefined();
    expect(keys.body.next).toBeDefined();
  });
};

export const thenDatesOfKeysShouldCrossEachOther = (
  then,
  app: () => INestApplication
) => {
  then(/^Then dates of keys should cross each other$/, async () => {
    const allKeys = await app()
      .get(AssociationKeysWrapperRepository)
      .repository.find({
        order: {
          validFrom: 'ASC',
        },
      });

    let previousKey;

    expect(allKeys.length).toBeGreaterThanOrEqual(1);

    for (const key of allKeys) {
      if (!previousKey) {
        previousKey = key;

        continue;
      }

      expect(moment(key.validFrom).isSame(previousKey.validTo));
    }
  });
};
