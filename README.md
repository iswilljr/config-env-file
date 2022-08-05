# CONFIG ENV FILE

A command line to generate a .env file based on a Config

## Install

```bash
# npm
npm install -g config-env-file
# yarn
yarn global add config-env-file
```

## Example

```bash
cef ./config.json
# config.json: { "api": 1, "key": 2 }
# output:
#   const config = { api: process.env.API, key: process.env.KEY }
# .env.local:
#   API=1
#   KEY=2
```

## Options

- `destination`: destination path to env file. default `"."`.
- `extension`: extension to env file name. default `"local"`.
- `prefix`: prefix to variables name. default `""`.
- `env`: how to access variables. choices process, import. default `"process"`.

Run `cef --help` for more information.
