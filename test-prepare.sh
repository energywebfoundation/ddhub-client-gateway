#!/bin/bash

#docker-compose -f docker-compose.test.yml down
#docker-compose -f docker-compose.test.yml up -d
#docker-compose -f docker-compose.test.yml exec vault_dev sh -c "vault secrets enable -version=1 -path=ddhub -address="http://127.0.0.1:8200" kv" || true
#
#

for i in {1..50}
do
  curl --location --request POST 'http://localhost:3333/api/v2/messages' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "fqcn": "noenc1test",
      "topicName": "testmessage1234",
      "topicVersion": "1.0.1",
      "topicOwner": "dsb.apps.szostak.iam.ewc",
      "payload": "{ \"data\": 105 }"
  }'
done

echo "done"
