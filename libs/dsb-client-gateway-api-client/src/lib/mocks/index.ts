import { faker } from '@faker-js/faker';

export const getIdentityControllerGetMock = () => ({
  address: '0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
  balance: 'OK',
  enrolment: {
    did: 'did:ethr:volta:0xfeFBb03EFc1054Cc4e3Fbf36362689cc1F5924a8',
    roles: [
      {
        namespace: 'user.roles.ddhub.apps.energyweb.iam.ewc',
        required: true,
        status: 'SYNCED',
      },
      {
        namespace: 'topiccreator.roles.ddhub.apps.energyweb.iam.ewc',
        required: true,
        status: 'SYNCED',
      },
    ],
  },
  publicKey:
    '0x04341da2f081cef1a9c19557551b9c9f10ce135eeec9e45a41f3750db8ef2d34e990b27ee730c6643d1862f5899dccbdf011e8a33fd8cd7de42442b0c7570540db',
});

export const getFrontendConfigMock = () => ({
  "topicManagement": {
    "allowedRoles": ["topiccreator"]
  },
  "myAppsAndTopics": {
    "allowedRoles": ["user"]
  },
  "channelManagement": {
    "allowedRoles": ["user"]
  },
  "largeFileUpload": {
    "allowedRoles": ["user"]
  },
  "largeFileDownload": {
    "allowedRoles": ["user"]
  },
  "fileUpload": {
    "allowedRoles": ["user"]
  },
  "fileDownload": {
    "allowedRoles": ["user"]
  }
})

export const getApplicationsControllerGetApplicationsMock = () => [
  {
    appName: 'Decentralised Data Hub',
    logoUrl: '/appIcon.svg',
    websiteUrl: faker.random.word(),
    description: faker.random.word(),
    namespace: 'ddhub.apps.energyweb.iam.ewc',
    topicsCount: faker.datatype.number({ min: 1, max: 10 }),
    createdDate: "2022-05-18T11:19:07.000Z",
    updatedDate: "2022-05-18T11:19:07.000Z",
  },
  {
    appName: 'Torta',
    logoUrl: '/appIcon.svg',
    websiteUrl: faker.random.word(),
    description: faker.random.word(),
    namespace: 'torta.apps.eggplant.vege.iam.ewc',
    topicsCount: faker.datatype.number({ min: 1, max: 10 }),
    createdDate: "2022-05-31T11:19:07.000Z",
    updatedDate: "2022-05-31T11:19:07.000Z",
  },
];

export const getTopicsControllerGetTopicsMock = (queryParams: any) => ({
      count: 24,
      limit: Number(queryParams.limit),
      page: Number(queryParams.page),
      records: [...Array(Number(queryParams.limit))].map(() => ({
        id: faker.datatype.uuid(),
        name: faker.word.noun(),
        owner: faker.random.arrayElement([
          'ddhub.apps.energyweb.iam.ewc',
          'torta.apps.eggplant.vege.iam.ewc',
        ]),
        schemaType: faker.random.arrayElement(['JSD7', 'XML', 'CSV', 'TSV']),
        tags: [...Array(3)].map(() => faker.word.noun()),
        version: '1.0.0',
      })),
    }

);

export const getTopicsControllerGetTopicsSearchMock = (queryParams: any) => ({
  count: 12,
  limit: Number(queryParams.limit),
  page: Number(queryParams.page),
  records: [...Array(6)].map(() => ({
    id: faker.datatype.uuid(),
    name: faker.word.noun(),
    owner: faker.random.arrayElement([
      'ddhub.apps.energyweb.iam.ewc',
      'torta.apps.eggplant.vege.iam.ewc',
    ]),
    schemaType: faker.random.arrayElement(['JSD7', 'XML', 'CSV', 'TSV']),
    tags: [...Array(3)].map(() => faker.word.noun()),
    version: '1.0.0',
  })),
}
);

export const getTopicsControllerPostTopicsMock = () => ({
  id: faker.random.word(),
  name: faker.random.word(),
  owner: faker.random.word(),
  schema: faker.random.word(),
  schemaType: faker.helpers.randomize(['JSD7', 'XML', 'CSV', 'TSV']),
  tags: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(() =>
    faker.random.word()
  ),
  version: faker.random.word(),
});

export const getTopicsControllerGetTopicsHistoryByIdMock = (queryParams: any) => {
  return {
    count: 8,
    limit: Number(queryParams.limit),
    page: Number(queryParams.page),
    records: [...Array(6)].map(() => ({
      id: faker.datatype.uuid(),
      name: faker.word.adverb(),
      owner: 'ddhub.apps.energyweb.iam.ewc',
      schema: { data: 'test' },
      schemaType: faker.random.arrayElement(['JSD7', 'XML', 'CSV', 'TSV']),
      tags: [...Array(1)].map(() => faker.word.noun()),
      version: '1.0.0',
      createdDate: "2022-06-08T05:43:15.510Z",
      updatedDate: "2022-06-08T05:43:15.510Z",
    })),
  };
};

export const getTopicsControllerGetTopicHistoryByIdAndVersionMock = () => ({
  id: faker.datatype.uuid(),
  name: faker.word.noun(),
  owner: 'ddhub.apps.energyweb.iam.ewc',
  schema: { data: 'test' },
  schemaType: faker.random.arrayElement(['JSD7', 'XML', 'CSV', 'TSV']),
  tags: [faker.word.noun()],
  version: '1.0.0',
});

export const getChannelControllerGetByTypeMock = () => [
  {
    fqcn: 'channel.name',
    type: 'sub',
    conditions: {
      dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
      roles: ['marketoperator.roles', 'marketoperator.roles', 'marketoperator.roles', 'marketoperator.roles', 'marketoperator.roles'],
      topics: [
        {
          topicName: 'operatorEnvelope',
          owner: 'ddhub.apps.energyweb.iam.ewc',
          topicId: '622fed6e4258501225095045',
        },
      ],
    },
  },
  {
    fqcn: 'channel.name.2',
    type: 'pub',
    conditions: {
      dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
      roles: ['marketoperator.roles'],
      topics: [
        {
          topicName: 'operatorEnvelope',
          owner: 'ddhub.apps.energyweb.iam.ewc',
          topicId: '622fed6e4258501225095046',
        },
      ],
    },
  },
  {
    fqcn: 'channel.name.3',
    type: 'upload',
    conditions: {
      dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
      roles: ['marketoperator.roles'],
      topics: [
        {
          topicName: 'operatorEnvelope',
          owner: 'ddhub.apps.energyweb.iam.ewc',
          topicId: '622fed6e4258501225095047',
        },
      ],
    },
  },
  {
    fqcn: 'channel.name.4',
    type: 'download',
    conditions: {
      dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
      roles: ['marketoperator.roles'],
      topics: [
        {
          topicName: 'operatorEnvelope',
          owner: 'ddhub.apps.energyweb.iam.ewc',
          topicId: '622fed6e4258501225095048',
        },
      ],
    },
  },
];

export const getChannelControllerGetMock = () => ({
  fqcn: 'channel.name',
  type: 'sub',
  conditions: {
    dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
    roles: [
      'marketoperator.roles',
      'operator.roles.application.apps.energyweb.iam.ewc',
    ],
    topics: [
      {
        topicName: 'operatorEnvelope',
        owner: 'ddhub.apps.energyweb.iam.ewc',
        topicId: '622fed6e4258501225095045',
      },
    ],
  },
});

export const getChannelMessagesMock = () => [
  {
    id: '6283374fbe281c73d1ba252b',
    topicVersion: '1.0.0',
    topicSchemaType: 'CSV',
    payload: '{"fileId":"62833e6ebe281c73d1ba2535"}',
    signature:
      '0xd3a2e04d344261ee648d00baba8477a575030371862ee9f11d339726cff8d47b579321dc99312c84d63ab33e065e752c9639a5615ed5c9bf757a634772c506dc1b',
    sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
    timestampNanos: 1652768367254,
    transactionId: "''",
    signatureValid: false,
    decryption: {
      status: true,
    },
  },
  {
    id: '6283374fbe281c73d1ba252b',
    topicVersion: '1.0.0',
    topicSchemaType: 'CSV',
    payload: '{"fileId":"62833e6ebe281c73d1ba2535"}',
    signature:
      '0xd3a2e04d344261ee648d00baba8477a575030371862ee9f11d339726cff8d47b579321dc99312c84d63ab33e065e752c9639a5615ed5c9bf757a634772c506dc1b',
    sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
    timestampNanos: 1652768367254,
    transactionId: "''",
    signatureValid: true,
    decryption: {
      status: true,
    },
  },
];

export const getDownloadMessageMock = () => ('text');

export const getCronMock = () => {
  return [
    {
      "jobName": "CHANNEL_ROLES",
      "latestStatus": "SUCCESS",
      "executedAt": "2022-06-02T09:06:00.521Z",
      "createdDate": "2022-05-25T22:35:00.000Z",
      "updatedDate": "2022-06-02T09:06:00.000Z"
    },
    {
      "jobName": "TOPIC_REFRESH",
      "latestStatus": "SUCCESS",
      "executedAt": "2022-06-02T09:06:40.663Z",
      "createdDate": "2022-05-25T22:35:00.000Z",
      "updatedDate": "2022-06-02T09:06:40.000Z"
    },
    {
      "jobName": "APPLICATIONS_REFRESH",
      "latestStatus": "SUCCESS",
      "executedAt": "2022-06-02T09:06:00.870Z",
      "createdDate": "2022-05-25T22:35:05.000Z",
      "updatedDate": "2022-06-02T09:06:00.000Z"
    },
    {
      "jobName": "SYMMETRIC_KEYS",
      "latestStatus": "SUCCESS",
      "executedAt": "2022-06-02T09:06:03.339Z",
      "createdDate": "2022-05-25T22:36:07.000Z",
      "updatedDate": "2022-06-02T09:06:03.000Z"
    }
  ]
}
