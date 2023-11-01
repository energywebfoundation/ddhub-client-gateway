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
  topicManagement: {
    allowedRoles: ['topiccreator'],
  },
  myAppsAndTopics: {
    allowedRoles: ['user'],
  },
  channelManagement: {
    allowedRoles: ['user'],
  },
  largeFileUpload: {
    allowedRoles: ['user'],
  },
  largeFileDownload: {
    allowedRoles: ['user'],
  },
  fileUpload: {
    allowedRoles: ['user'],
  },
  fileDownload: {
    allowedRoles: ['user'],
  },
  messageInbox: {
    allowedRoles: ['user'],
  },
  messageOutbox: {
    allowedRoles: ['user'],
  },
});

export const getApplicationsControllerGetApplicationsMock = () => [
  {
    appName: 'Decentralised Data Hub',
    logoUrl: '/appIcon.svg',
    websiteUrl: faker.random.word(),
    description: faker.random.word(),
    namespace: 'ddhub.apps.energyweb.iam.ewc',
    topicsCount: faker.datatype.number({ min: 1, max: 10 }),
    createdDate: '2022-05-18T11:19:07.000Z',
    updatedDate: '2022-05-18T11:19:07.000Z',
  },
  {
    appName: 'Torta',
    logoUrl: '/appIcon.svg',
    websiteUrl: faker.random.word(),
    description: faker.random.word(),
    namespace: 'torta.apps.eggplant.vege.iam.ewc',
    topicsCount: faker.datatype.number({ min: 1, max: 10 }),
    createdDate: '2022-05-31T11:19:07.000Z',
    updatedDate: '2022-05-31T11:19:07.000Z',
  },
];

export const getTopicsControllerGetTopicsMock = (queryParams: any) => ({
  count: 24,
  limit: Number(queryParams.limit),
  page: Number(queryParams.page),
  records: [...Array(10)].map(() => ({
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
});

export const getTopicsControllerGetTopicsSearchMock = (queryParams: any) => ({
  count: 12,
  limit: Number(queryParams.limit),
  page: Number(queryParams.page),
  records: [...Array(10)].map(() => ({
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
});

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

export const getTopicsControllerGetTopicsHistoryByIdMock = (
  queryParams: any
) => {
  return {
    count: 12,
    limit: Number(queryParams.limit),
    page: Number(queryParams.page),
    records: [...Array(10)].map(() => ({
      id: faker.datatype.uuid(),
      name: faker.word.adverb(),
      owner: 'ddhub.apps.energyweb.iam.ewc',
      schema: { data: 'test' },
      schemaType: faker.random.arrayElement(['JSD7', 'XML', 'CSV', 'TSV']),
      tags: [...Array(1)].map(() => faker.word.noun()),
      version: '1.0.0',
      createdDate: '2022-06-08T05:43:15.510Z',
      updatedDate: '2022-06-08T05:43:15.510Z',
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
    payloadEncryption: false,
    type: 'sub',
    useAnonymousExtChannel: true,
    messageForms: false,
    conditions: {
      dids: ['did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993'],
      roles: [
        'marketoperator.roles',
        'marketoperator.roles',
        'marketoperator.roles',
        'marketoperator.roles',
        'marketoperator.roles',
      ],
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
    payloadEncryption: false,
    type: 'pub',
    useAnonymousExtChannel: false,
    messageForms: true,
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
      responseTopics: [
        {
          topicName: 'operatorEnvelope',
          owner: 'ddhub.apps.energyweb.iam.ewc',
          topicId: '622fed6e4258501225095046',
          schemaType: 'JSD7',
        },
        {
          topicName: 'operatorEnvelope 2',
          owner: 'ddhub.apps.energyweb.iam.ewc',
          topicId: '622fed6e4258501225095046',
          schemaType: 'JSD7',
        },
      ],
    },
  },
  {
    fqcn: 'channel.name.3',
    payloadEncryption: true,
    type: 'upload',
    useAnonymousExtChannel: true,
    messageForms: false,
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
    payloadEncryption: false,
    type: 'download',
    useAnonymousExtChannel: false,
    messageForms: false,
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
    topicName: 'operatingEnvelope',
    topicOwner: 'ddhub.apps.energyweb.iam.ewc',
    topicVersion: '1.0.0',
    topicSchemaType: 'CSV',
    payload: '{"fileId":"62833e6ebe281c73d1ba2535"}',
    signature:
      '0xd3a2e04d344261ee648d00baba8477a575030371862ee9f11d339726cff8d47b579321dc99312c84d63ab33e065e752c9639a5615ed5c9bf757a634772c506dc1b',
    sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
    timestampNanos: 1662428065121000000,
    transactionId: 'TRXS00000001',
    signatureValid: false,
  },
  {
    id: '6283374fbe281c73d1ba252c',
    topicName: 'srcEvent',
    topicOwner: 'ddhub.apps.energyweb.iam.ewc',
    topicVersion: '1.0.0',
    topicSchemaType: 'CSV',
    payload: '{"fileId":"62833e6ebe281c73d1ba2535"}',
    signature:
      '0xd3a2e04d344261ee648d00baba8477a575030371862ee9f11d339726cff8d47b579321dc99312c84d63ab33e065e752c9639a5615ed5c9bf757a634772c506dc1b',
    sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
    timestampNanos: 1662428065121000000,
    transactionId: 'TRXS000000002',
    signatureValid: true,
  },
  {
    id: '6283374fbe281c73d1ba252f',
    topicName: 'responseTopicSample',
    topicOwner: 'ddhub.apps.energyweb.iam.ewc',
    topicVersion: '1.0.0',
    topicSchemaType: 'JSD7',
    payload:
      '{"nssContractId":"1056","services":[{"facilityCode":"A001","feederDxtxId":"12423300","nssProvisionMW":45,"nssProvisionEndDate":"2023-10-01","nssProvisionStartDate":"2023-09-01","dispatchIntervalTo":10,"nssServiceId":"908","dispatchIntervalFrom":1,"nssServiceType":"FEEDER_FWD"}],"tni":"tnidesc"}',
    signature:
      '0xd3a2e04d344261ee648d00baba8477a575030371862ee9f11d339726cff8d47b579321dc99312c84d63ab33e065e752c9639a5615ed5c9bf757a634772c506dc1b',
    sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
    timestampNanos: 1662428065121000000,
    transactionId: 'TRXS00000001',
    signatureValid: false,
  },
];

export const getDownloadMessageMock = () => 'text';

export const getMessagesSentMock = () => {
  return [
    {
      clientGatewayMessageId: '110',
      topicName: 'getOperatingEnvelope',
      topicOwner: 'torta.apps.eggplant.vege.iam.ewc',
      topicVersion: '1.0.0',
      topicSchemaType: 'JSD7',
      payload: '{"fileId":"624bfd4f4c6cf04abfc20041"}',
      signature:
        '0x0abc6026b01856a756de47ec6f44d9c14fe69009bbf3b9b6cf522d8d783a1c654425848381affca5dab9284d8715fa2f9e34155374bafd923d75c219496cbe161c',
      sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
      timestampNanos: 1649147198388,
      transactionId: '1649147198388',
      signatureValid: 'SUCCESS',
      relatedMessagesCount: 5,
      recipients: [
        {
          did: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
          failed: false,
          messageId: '123',
        },
      ],
    },
    {
      clientGatewayMessageId: '111',
      topicName: 'responseTopicSample',
      topicOwner: 'torta.apps.eggplant.vege.iam.ewc',
      topicVersion: '1.0.0',
      topicSchemaType: 'JSD7',
      payload:
        '{"nssContractId":"1056","services":[{"facilityCode":"A001","feederDxtxId":"12423300","nssProvisionMW":45,"nssProvisionEndDate":"2023-10-01","nssProvisionStartDate":"2023-09-01","dispatchIntervalTo":10,"nssServiceId":"908","dispatchIntervalFrom":1,"nssServiceType":"FEEDER_FWD"}],"tni":"tnidesc"}',
      signature:
        '0x0abc6026b01856a756de47ec6f44d9c14fe69009bbf3b9b6cf522d8d783a1c654425848381affca5dab9284d8715fa2f9e34155374bafd923d75c219496cbe161c',
      sender: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
      timestampNanos: 1649147198388,
      transactionId: '1649147198388',
      signatureValid: 'SUCCESS',
      relatedMessagesCount: 2,
      recipients: [
        {
          did: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457D',
          failed: false,
          messageId: '123',
        },
        {
          did: 'did:ethr:volta:0x03830466Ce257f9B798B0f27359D7639dFB6457F',
          failed: false,
          messageId: '124',
        },
      ],
    },
    {
      initiatingMessageId: null,
      topicName: 'messageWithArray',
      clientGatewayMessageId: 'ad57cb3e-b542-40d0-9b53-117f9de06b9f',
      topicId: '64e5b895986aee0cfb658c25',
      topicVersion: '4.0.0',
      transactionId: null,
      signature:
        '0xf02aa55228961637a42c0d0a05486368f6385825d26eeca6a8a99e6d5937899520e07c23990f6d4dbd7e7fe879ac3e965019c8034697f2ac84bfd4e93fd229751c',
      payloadEncryption: false,
      timestampNanos: '2023-09-13 16:32:38.512',
      isFile: false,
      totalRecipients: '28',
      totalSent: '27',
      totalFailed: '1',
      createdDate: '2023-09-13',
      updatedDate: '2023-09-13',
      initiatingTransactionId: null,
      senderDid: 'did:ethr:volta:0x552761011ea5b332605Bc1Cc2020A4a4f8C738CD',
      payload:
        '[{"firstName":"Bob","checkboxes":[{"name":"New York","lon":74,"lat":40},{"name":"Amsterdam","lon":5,"lat":52}],"options":["Option 1","Option 2"],"moreOptions":["B","C"],"multiSelect":[{"name":"Hong Kong","lon":114,"lat":22},{"name":"Amsterdam","lon":5,"lat":52}],"transactionId":"1234","lastName":"Norris","location":{"name":"Hong Kong","lon":114,"lat":22},"locationRadio":{"name":"Hong Kong","lon":114,"lat":22},"age":21}, {"firstName":"Chuck","checkboxes":[{"name":"New York","lon":74,"lat":40},{"name":"Amsterdam","lon":5,"lat":52}],"options":["Option 1","Option 2"],"moreOptions":["B","C"],"multiSelect":[{"name":"Hong Kong","lon":114,"lat":22},{"name":"Amsterdam","lon":5,"lat":52}],"transactionId":"1234","lastName":"Norris","location":{"name":"Hong Kong","lon":114,"lat":22},"locationRadio":{"name":"Hong Kong","lon":114,"lat":22},"age":21}]',
    },
  ];
};

export const getCronMock = () => {
  return [
    {
      jobName: 'CHANNEL_ROLES',
      latestStatus: 'SUCCESS',
      executedAt: '2022-06-02T09:06:00.521Z',
      createdDate: '2022-05-25T22:35:00.000Z',
      updatedDate: '2022-06-02T09:06:00.000Z',
    },
    {
      jobName: 'TOPIC_REFRESH',
      latestStatus: 'SUCCESS',
      executedAt: '2022-06-02T09:06:40.663Z',
      createdDate: '2022-05-25T22:35:00.000Z',
      updatedDate: '2022-06-02T09:06:40.000Z',
    },
    {
      jobName: 'APPLICATIONS_REFRESH',
      latestStatus: 'SUCCESS',
      executedAt: '2022-06-02T09:06:00.870Z',
      createdDate: '2022-05-25T22:35:05.000Z',
      updatedDate: '2022-06-02T09:06:00.000Z',
    },
    {
      jobName: 'SYMMETRIC_KEYS',
      latestStatus: 'SUCCESS',
      executedAt: '2022-06-02T09:06:03.339Z',
      createdDate: '2022-05-25T22:36:07.000Z',
      updatedDate: '2022-06-02T09:06:03.000Z',
    },
    {
      jobName: 'ROLES_REFRESH',
      latestStatus: 'SUCCESS',
      executedAt: '2022-06-02T09:06:03.339Z',
      createdDate: '2022-05-25T22:36:07.000Z',
      updatedDate: '2022-06-02T09:06:03.000Z',
    },
  ];
};

export const getGatewayMock = () => {
  return {
    did: 'string',
    messageBrokerStatus: 'OK',
    mtlsIsValid: true,
    namespace: 'ddhub.apps.energyweb.iam.ewc',
    version: 'v15.15.0',
  };
};

export const getClientsMock = () => {
  return [
    {
      id: 'd682d25f-24b0-4b9f-afcc-08a40f8855d1',
      clientId: 'test.cursor',
      createdDate: '2022-09-21 08:04:06.020037',
      updatedDate: '2022-09-21 08:04:06.020037',
    },
    {
      id: 'd682d25f-24b0-4b9f-afcc-08a40f8855d2',
      clientId: 'test.cursor2',
      createdDate: '2022-09-21 08:04:06.020037',
      updatedDate: '2022-09-21 08:04:06.020037',
    },
  ];
};

export const getChannelMessagesCount = () => {
  return [
    {
      count: 1,
      fqcn: 'channel.name',
    },
    {
      count: 5,
      fqcn: 'channel.name2',
    },
    {
      count: 2,
      fqcn: 'channel.name3',
    },
  ];
};

export const getChannelMessagesCountByFqcn = () => {
  return {
    count: 3,
  };
};

export const postMessageMock = () => {
  return {
    clientGatewayMessageId: 'a6072307-5d65-4f3a-8e57-9db899b5d853',
    recipients: {
      failed: 1,
      sent: 1,
      total: 2,
    },
    status: [
      {
        details: [
          {
            did: 'did:ethr:volta:0x552761011ea5b332605Bc1Cc2020A4a4f8C738CD',
            messageId: '6359e97b15f7386ee0a3fd34',
            statusCode: 200,
          },
        ],
        name: 'SENT',
      },
      {
        details: [
          {
            did: 'did:ethr:volta:0x6d0175fB07325925766A5B68A1cDbb459C2DFa1b',
            err: {
              code: 'MB::INVALID_FQCN',
              reason:
                'fqcn:did:ethr:volta:0x6d0175fB07325925766A5B68A1cDbb459C2DFa1b not exists',
            },
            statusCode: 500,
          },
        ],
        name: 'FAILED',
      },
    ],
  };
};

export const getContactsMock = () => {
  return [
    {
      did: 'did:ethr:volta:0x782aB0383Bfc807439d8EE29516937B47815d697',
      alias: 'Krzysztof Szostak',
    },
  ];
};
