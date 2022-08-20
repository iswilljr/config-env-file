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
#   const config = { api: process.env.API, key: process.env.KEY }
# .env.local:
#   API=1
#   KEY=2
```

### Example with a firebase project

When you use firebase in your app, you might not want to expose the firebase config. Pass the config to an `.env` file may take a while doing it by hand. This is a simple example to generate a `.env` file from a firebase config.

`run:`

```bash
touch firebase.config.json
# copy the firebase config to firebase.config.json
cef firebase.config.json
```

`firebase.config.json:`

```json
{
  "apiKey": "example",
  "authDomain": "example.firebaseapp.com",
  "projectId": "example",
  "storageBucket": "example.appspot.com",
  "messagingSenderId": "example",
  "appId": "1:example:web:example"
}
```

`.env.local:`

```env
API_KEY=example
AUTH_DOMAIN=example.firebaseapp.com
PROJECT_ID=example
STORAGE_BUCKET=example.appspot.com
MESSAGING_SENDER_ID=example
APP_ID=1:example:web:example
```

`output:`

```javascript
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
```

## Options

- `destination`: destination path to env file. default `"."`.
- `extension`: extension to env file name. default `"local"`.
- `prefix`: prefix to variables name. default `undefined`.
- `env`: how to access variables. choices `"process"`, `"import"`. default `"process"`.

Run `cef --help` for more information.
