import hashlib
import hmac
import json
import secrets
import subprocess
import sys
from base64 import urlsafe_b64encode
from os import path

KEY_SIZE = 32
SALT_SIZE = 16

API_KEYS_FILE_NAME = "hashed-api-keys.json"
FIXED_SALT = "BQdukbfdC0ouGuCyCEKrYA=="
FIXED_SALT_BYTES = FIXED_SALT.encode()
ALL_SCOPES = [
    ("get", "/openai/v1/models"),
    ("post", "/openai/v1/chat/completions"),
    ("post", "/openai/v1/embeddings")
]


def write_to_file(file, all_credentials):
    file.seek(0)
    file.write(json.dumps(all_credentials, indent=2, separators=(',', ': ')))
    file.truncate()


def generate_new_api_key():
    return secrets.token_urlsafe(KEY_SIZE)


def existing_usernames(all_hashed_api_keys_with_salt):
    return [value['username'] for value in all_hashed_api_keys_with_salt.values()]


def parse_arguments(sys_argvs):
    if len(sys_argvs) < 3:
        print(
            "Pass 'all' for all scopes (provider method and path) or a comma separated list for specific scope to register the new API key (e.g. get:/openai/v1/models,post:/openai/v1/chat/completions)")
        exit(1)
    elif len(sys_argvs) == 3 and sys_argvs[2] == "all":
        scopes = ALL_SCOPES
    else:
        scopes = [tuple(x.split(':')) for x in sys.argv[2].split(',')]

    if all(x in ALL_SCOPES for x in scopes):
        return sys.argv[1], scopes
    else:
        print(f"There is at least one scope {scopes} not valid")
        exit(1)


def main():
    username, scopes = parse_arguments(sys.argv)
    print(f"Registering API key for user:{username} with scopes:{str(scopes)}")
    confirm_registration = input("Do you want to proceed: with yes (y) or no (n)\n")
    if confirm_registration in ['yes', 'y']:
        user_api_key = {"username": username}
        api_keys_file_path = path.join(f"../provision/secrets/{API_KEYS_FILE_NAME}")
        with open(api_keys_file_path, 'r+') as api_keys_file:
            file_data = api_keys_file.read()
            if len(file_data) == 0:
                all_hashed_api_keys_with_salt = {}
            else:
                all_hashed_api_keys_with_salt = json.loads(file_data)
            if username in existing_usernames(all_hashed_api_keys_with_salt):
                print(f"Username {username} is already registered")
            else:
                new_api_key = generate_new_api_key()
                # salt = urandom(SALT_SIZE)
                user_api_key['api_key'] = new_api_key
                # hashed_api_key = hmac.new(salt, new_api_key.encode(), hashlib.sha256).hexdigest()
                hashed_api_key = hmac.new(FIXED_SALT_BYTES, new_api_key.encode(), hashlib.sha256).hexdigest()
                # TODO: add org, system-id, cost allocation fetched by LDAP?
                all_hashed_api_keys_with_salt[hashed_api_key] = {
                    "username": username,
                    # to save in file to later use to hash in the same way
                    "salt": urlsafe_b64encode(FIXED_SALT_BYTES).decode("iso-8859-1"),
                    "scopes": [{"method": method, "path": path} for method, path in scopes]
                }
                write_to_file(api_keys_file, all_hashed_api_keys_with_salt)

        if len(user_api_key.keys()) == 1:
            print('No new API key created')
        else:
            print("Send the credentials below via yopass")
            print(json.dumps(user_api_key, indent=2, separators=(',', ': ')))
    else:
        print("Aborted")


if __name__ == "__main__":
    main()
