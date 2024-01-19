#!/bin/bash

if [[ $1 == "--test" ]]; then
  echo "Encoding test"
  hashed_api_keys_value=$(cat <./provision/secrets/hashed-api-keys.test.json  | base64 | tr -d \\n)
else
  echo "Encoding production"
  hashed_api_keys_value=$(cat <./provision/secrets/hashed-api-keys.json  | base64 | tr -d \\n)
fi

echo "Base64 Encoded hashed: ${hashed_api_keys_value}"
decoded_api_keys_value=$(echo "${hashed_api_keys_value}" | base64 -d)
echo "Base64 Decoded hashed: ${decoded_api_keys_value}"
