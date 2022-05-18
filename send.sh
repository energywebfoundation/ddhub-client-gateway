#!/bin/bash

while true
do
  curl --location --request POST 'http://localhost:3333/api/v2/messages' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "fqcn": "channel.send",
      "topicName": "Vikas_Topic_JSON_V3",
      "topicVersion": "1.0.0",
      "topicOwner": "dsb.apps.szostak.iam.ewc",
      "transactionId": "",
      "payload": "{ \"data\": 104 }"
  }'

  sleep 2
done



