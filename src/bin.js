#!/usr/bin/env node
import { createRequire } from "module";
import sade from "sade";
import { getConfig, stringifyConfig } from "./common.js";
import { configEnvFile } from "./index.js";

const pkg = createRequire(import.meta.url)("../package.json");

const cef = sade("cef <config-file>", true).version(pkg.version).describe(pkg.description);

cef
  .option("-d, --destination <d>", "destination path to env file", ".")
  .option("-e, --extension <e>", "extension to env file name")
  .option("-p, --prefix <p>", "prefix to variables name")
  .option("-q, --single-quotes", "use single quotes", false)
  .option("-n, --no-quotes", "don't add quotes to env values", false)
  .option("-i, --include-objects", "include object values", false)
  .option("-s, --silent", "skip console logs", false)
  .option("-E, --env <e>", "how to access variables  (options: process, import)", "process");

cef
  .example("config.json # creates .env.local file with variables from config.json")
  .example("config.json -d ./my-app # creates .env.local to ./my-app")
  .example("config.json -e prod # creates env file like .env.prod")
  .example("config.json -p my_app # creates env vars with prefix MY_APP")
  .example("config.json -E import # output will be print with import.meta.env");

cef.action((file, options) => runCef(file, options)).parse(process.argv);

async function runCef(file, options) {
  try {
    await configEnvFile(file, options);

    const config = await getConfig(file);
    const configString = stringifyConfig({ config, env: options.env, includeObjects: options.i, prefix: options.p });

    if (options.silent) return;

    console.info(configString);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
