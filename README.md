# CONFIG ENV FILE

> A command line to generate a `.env` file based on a Config

## Why?

If you have a config in a json format and you don't want to expose your config to the public, you can pass it to a `.env` file but make a `.env` file by hand with the json file may take a while. This command will generate a `.env` file for you.

## Install

```bash
# npm
npm install -g config-env-file
# npx
npx config-env-file [config-file] [options]
# yarn
yarn global add config-env-file
```

## Usage

```bash
cef ./config.json
# config.json: { "api": 1, "key": 2 }
# output:
#   const config = {
#     api: process.env.API,
#     key: process.env.KEY
#   }
# .env.local:
#   API="1"
#   KEY="2"
```

### Example with a firebase project

When you use firebase in your app, you might not want to expose the firebase config. Pass the config to an `.env` file may take a while doing it by hand. This is a simple example to generate a `.env` file from a firebase config.

```bash
touch firebase.config.json
# copy the firebase config to firebase.config.json
# firebase.config.json:
# { "apiKey": "example", "authDomain": "example.firebaseapp.com", ... }

cef firebase.config.json
# .env.local:
# API_KEY="example"
# AUTH_DOMAIN="example.firebaseapp.com"
# ...

# output:
# const config = {
#   apiKey: process.env.API_KEY,
#   authDomain: process.env.AUTH_DOMAIN
#   ...
# }
```

## Options

### Prefix

add prefix to variables name. default `undefined`

```bash
cef ./config.json --prefix public
# config.json: { "apiUrl": "https://..." }
# output:
#   const config = {
#     apiUrl: process.env.PUBLIC_API_URL,
#   }
# .env.local:
#   PUBLIC_API_URL="https://..."
```

### Include Objects Values

whether to include object values or not. default `false`.

```bash
# config: { "api": 6, "client": { "id": 1, "secret": 6 } }

cef ./config.json
# .env.local:
#   API="6"

cef ./config.json --include-objects
# .env.local:
#   API="6"
#   CLIENT="{"id":1,"secret":6}"
```

### Env

how to access variables. choices `"process"`, `"import"`. default `"process"`.

```bash
cef ./config.json --env import
# output:
#   const config = {
#     api: import.meta.env.API,
#     key: import.meta.env.KEY
#   }
```

### Other options

- `destination`: destination path to env file. default `"."`.
- `extension`: extension to env file name. default `"local"`.
- `single-quotes`: use single quotes in env values. default `false`.
- `no-quotes`: don't add quotes to env values. default `false`.
- `silent`: skip console logs. default `false`.

Run `cef --help` for more information.
