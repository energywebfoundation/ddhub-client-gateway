import { faker } from '@faker-js/faker';

export const getIdentityControllerGetMock = () => ({
  address: '0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  balance: 'OK',
  enrolment: {
    did: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
    roles: [
      {
        namespace: 'user.roles.dsb.apps.szostak.iam.ewc',
        required: true,
        status: 'SYNCED',
      },
    ],
  },
  publicKey:
    '0x04341da2f081cef1a9c19557551b9c9f10ce135eeec9e45a41f3750db8ef2d34e990b27ee730c6643d1862f5899dccbdf011e8a33fd8cd7de42442b0c7570540db',
});

export const getApplicationsControllerGetApplicationsMock = () =>
  [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
    appName: faker.random.word(),
    logoUrl: faker.image.abstract(),
    websiteUrl: faker.random.word(),
    description: faker.random.word(),
    namespace: faker.random.word(),
    topicsCount: faker.datatype.number(),
  }));

export const getTopicsControllerGetTopicsMock = () => ({
  count: 6,
  limit: 6,
  page: 1,
  records: [...Array(6)].map(() => ({
    id: faker.unique,
    name: faker.word.adverb,
    owner: 'ddhub.apps.energyweb.iam.ewc',
    schema: "{\"data\":\"test\"}",
    schemaType: faker.helpers.randomize(['JSD7', 'XML', 'XSD6', 'CSV', 'TSV']),
    tags: [...Array(3)].map(() =>
      faker.word.noun
    ),
    version: '1.0.0',
  })),
});

export const getTopicsControllerPostTopicsMock = () => ({
  id: faker.random.word(),
  name: faker.random.word(),
  owner: faker.random.word(),
  schema: faker.random.word(),
  schemaType: faker.helpers.randomize(['JSD7', 'XML', 'XSD6', 'CSV', 'TSV']),
  tags: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
    faker.random.word()
  ),
  version: faker.random.word(),
});
