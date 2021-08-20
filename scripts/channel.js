const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: '0d0db676-4da7-414e-a36c-a4b62b151d22',
    title: 'test',
    type: 'object',
    required: [
        'id',
        'name'
    ],
    properties: {
        id: {
            'type': 'integer'
        },
        name: {
            type: 'string'
        }
    }
}

const dids = [
    'did:ethr:0x8adc5FFD53f13Df59bf2D17C7489595a87B705c9',
    'did:ethr:0x3E8c2db768f876907C54F52B9e6Cc7F8E48d850F'
]

console.log(JSON.stringify({
    fqcn: "test.channels.dsb.apps.energyweb.iam.ewc",
    topics: [{
        namespace: "test",
        schema: JSON.stringify(schema)
    }],
    admins: dids,
    publishers: dids,
    subscribers: dids,
    maxMsgAge: 86400000000,
    maxMsgSize: 10240
}, null, 2))
