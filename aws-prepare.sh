#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
  # Export AWS variables specifically, ignoring comments and using grep
  export $(grep -E '^AWS_(ACCESS_KEY_ID|SECRET_ACCESS_KEY|REGION)=' .env | xargs)
fi

# Ensure AWS region is set (defaults to us-west-2 from your .env)
REGION=${AWS_REGION:-us-west-2}

echo "Using AWS Region: $REGION"

create_or_update_secret() {
  local secret_name=$1
  local secret_value=$2

  # Check if secret already exists
  if aws secretsmanager describe-secret --secret-id "$secret_name" --region "$REGION" >/dev/null 2>&1; then
    echo "Updating existing secret: $secret_name"
    aws secretsmanager put-secret-value \
      --secret-id "$secret_name" \
      --secret-string "$secret_value" \
      --region "$REGION" >/dev/null
  else
    echo "Creating new secret: $secret_name"
    aws secretsmanager create-secret \
      --name "$secret_name" \
      --secret-string "$secret_value" \
      --region "$REGION" >/dev/null
  fi
}

create_or_update_secret "ddhub/users/superadmin" '{"password":"test123","role":"superadmin"}'
create_or_update_secret "ddhub/users/admin" '{"password":"test123","role":"admin"}'
create_or_update_secret "ddhub/users/user" '{"password":"test123","role":"user"}'
create_or_update_secret "ddhub/users/messaging" '{"password":"energyweb123","role":"messaging"}'

echo "AWS Secrets preparation completed!"
