import { faker } from '@faker-js/faker';

export const getHealthControllerCheckMock = () => ({
  status: faker.helpers.randomize([faker.random.word(), undefined]),
  info: faker.helpers.randomize([
    {
      cl1xsty5g00008bdhfot69yom: {
        status: faker.helpers.randomize([faker.random.word(), undefined]),
      },
    },
    undefined,
  ]),
  error: faker.helpers.randomize([
    {
      cl1xsty5g00018bdhb1vb5awj: {
        status: faker.helpers.randomize([faker.random.word(), undefined]),
      },
    },
    undefined,
  ]),
  details: faker.helpers.randomize([
    {
      cl1xsty5g00028bdhadsf5z8a: {
        status: faker.helpers.randomize([faker.random.word(), undefined]),
      },
    },
    undefined,
  ]),
});

export const getIdentityControllerGetMock = () => ({
  address: '0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  balance: 'OK',
  enrolment: {
    did: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
    roles: [
      {
        namespace: 'user.roles.dsb.apps.szostak.iam.ewc',
        required: true,
        status: 'APPROVED',
      },
    ],
  },
  publicKey:
    '0x04341da2f081cef1a9c19557551b9c9f10ce135eeec9e45a41f3750db8ef2d34e990b27ee730c6643d1862f5899dccbdf011e8a33fd8cd7de42442b0c7570540db',
});

export const getIdentityControllerPostMock = () => ({
  address: faker.random.word(),
  balance: faker.helpers.randomize(['LOW', 'OK', 'NONE']),
  enrolment: {
    did: faker.random.word(),
    roles: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
      namespace: faker.random.word(),
      required: faker.datatype.boolean(),
      status: faker.helpers.randomize([
        'NOT_ENROLLED',
        'AWAITING_APPROVAL',
        'APPROVED',
        'REJECTED',
        'SYNCED',
      ]),
    })),
  },
  publicKey: faker.random.word(),
});

export const getIdentityControllerGetClaimsMock = () => ({});

export const getChannelControllerCreateMock = () => ({});

export const getChannelControllerGetByTypeMock = () =>
  [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
    fqcn: faker.random.word(),
    type: faker.helpers.randomize(['sub', 'pub']),
    conditions: {
      dids: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
        faker.random.word()
      ),
      roles: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
        faker.random.word()
      ),
      topics: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(
        () => ({
          topicName: faker.random.word(),
          owner: faker.random.word(),
          topicId: faker.random.word(),
        })
      ),
    },
  }));

export const getChannelControllerGetMock = () => ({
  fqcn: faker.random.word(),
  type: faker.helpers.randomize(['sub', 'pub']),
  conditions: {
    dids: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
      faker.random.word()
    ),
    roles: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
      faker.random.word()
    ),
    topics: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
      topicName: faker.random.word(),
      owner: faker.random.word(),
      topicId: faker.random.word(),
    })),
  },
});

export const getChannelControllerUpdateMock = () => ({});

export const getChannelControllerGetQualifiedDidsMock = () => ({
  fqcn: faker.random.word(),
  qualifiedDids: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(
    () => faker.random.word()
  ),
  updatedAt: faker.random.word(),
});

export const getMessageControlllerGetMessageMock = () => ({
  id: faker.random.word(),
  topicName: faker.random.word(),
  topicOwner: faker.random.word(),
  topicVersion: faker.random.word(),
  payload: faker.random.word(),
  signature: faker.random.word(),
  sender: faker.random.word(),
  timestampNanos: faker.datatype.number(),
  transactionId: faker.random.word(),
  signatureValid: faker.datatype.boolean(),
});

export const getMessageControlllerCreateMock = () => ({
  clientGatewayMessageId: faker.random.word(),
  did: faker.random.word(),
  recipients: {
    total: faker.datatype.number(),
    sent: faker.datatype.number(),
    failed: faker.datatype.number(),
  },
  status: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
    details: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
      did: faker.random.word(),
      messageId: faker.random.word(),
      statusCode: faker.datatype.number(),
    })),
    name: faker.random.word(),
  })),
});

export const getMessageControlllerUploadFileMock = () => ({
  clientGatewayMessageId: faker.random.word(),
  did: faker.random.word(),
  recipients: {
    total: faker.datatype.number(),
    sent: faker.datatype.number(),
    failed: faker.datatype.number(),
  },
  status: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
    details: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
      did: faker.random.word(),
      messageId: faker.random.word(),
      statusCode: faker.datatype.number(),
    })),
    name: faker.random.word(),
  })),
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
  count: faker.datatype.number(),
  limit: faker.datatype.number(),
  page: faker.datatype.number(),
  records: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() => ({
    id: faker.random.word(),
    name: faker.random.word(),
    owner: faker.random.word(),
    schema: faker.random.word(),
    schemaType: faker.helpers.randomize(['JSD7', 'XML', 'XSD6', 'CSV', 'TSV']),
    tags: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
      faker.random.word()
    ),
    version: faker.random.word(),
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

export const getTopicsControllerGetTopicsCountByOwnerMock = () => ({
  owner: faker.datatype.number(),
});

export const getTopicsControllerUpdateTopicsMock = () => ({
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

export const getTopicsControllerDeleteTopicsMock = () => ({
  timestamp: faker.random.word(),
  returnCode: faker.random.word(),
  returnMessage: faker.random.word(),
});

export const getTopicsControllerDeleteTopicsByVersionMock = () => ({
  timestamp: faker.random.word(),
  returnCode: faker.random.word(),
  returnMessage: faker.random.word(),
});
