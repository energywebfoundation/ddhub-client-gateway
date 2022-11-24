#!/bin/bash

docker-compose -f docker-compose.test.yml down
docker-compose -f docker-compose.test.yml up -d
docker-compose -f docker-compose.test.yml exec vault_dev sh -c "vault secrets enable -version=1 -path=ddhub -address="http://127.0.0.1:8200" kv" || true


