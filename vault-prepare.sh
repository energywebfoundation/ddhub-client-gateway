#!/bin/bash

docker compose -f docker-compose.yml exec vault_dev sh -c "vault secrets enable -version=1 -path=ddhub -address="http://127.0.0.1:8200" kv"
docker compose -f docker-compose.yml exec vault_dev sh -c "vault kv put -address="http://127.0.0.1:8200" ddhub/users/superadmin password=Test123! role=superadmin"
docker compose -f docker-compose.yml exec vault_dev sh -c "vault kv put -address="http://127.0.0.1:8200" ddhub/users/admin password=Test123! role=admin"
docker compose -f docker-compose.yml exec vault_dev sh -c "vault kv put -address="http://127.0.0.1:8200" ddhub/users/user password=Test123! role=user"
docker compose -f docker-compose.yml exec vault_dev sh -c "vault kv put -address="http://127.0.0.1:8200" ddhub/users/messaging password=Test123! role=messaging"

