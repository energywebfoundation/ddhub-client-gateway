#!/bin/bash

while true
do
  curl --location --request GET 'http://localhost:3333/api/v2/messages?fqcn=channel.sub&amount=1&topicName=Vikas_Topic_JSON_V3&topicOwner=dsb.apps.szostak.iam.ewc&clientId=test2'
  sleep 2
done



