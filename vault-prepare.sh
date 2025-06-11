#!/bin/bash

docker compose -f docker-compose.yml exec vault_dev sh -c "vault secrets enable -version=1 -path=ddhub -address="http://127.0.0.1:8200" kv"
docker compose -f docker-compose.yml exec vault_dev sh -c "vault kv put -address="http://127.0.0.1:8200" ddhub/users/admin password=test123 role=admin"
docker compose -f docker-compose.yml exec vault_dev sh -c "vault kv put -address="http://127.0.0.1:8200" ddhub/users/messaging password=energyweb123 role=messaging"

